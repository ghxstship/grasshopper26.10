/**
 * Brute Force Protection
 * Prevents brute force attacks on authentication endpoints
 */

interface LoginAttempt {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// In-memory store (use Redis in production)
const loginAttempts = new Map<string, LoginAttempt>();

// Configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const PROGRESSIVE_DELAYS = [0, 1000, 2000, 5000, 10000]; // ms

/**
 * Record a failed login attempt
 * @param identifier - Email or IP address
 * @returns Remaining attempts before lockout
 */
export function recordFailedAttempt(identifier: string): {
  remainingAttempts: number;
  lockedUntil?: Date;
  delayMs: number;
} {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt) {
    // First failed attempt
    loginAttempts.set(identifier, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return {
      remainingAttempts: MAX_ATTEMPTS - 1,
      delayMs: PROGRESSIVE_DELAYS[0] || 0,
    };
  }

  // Check if window has expired
  if (now - attempt.firstAttempt > WINDOW_MS) {
    // Reset counter
    loginAttempts.set(identifier, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return {
      remainingAttempts: MAX_ATTEMPTS - 1,
      delayMs: PROGRESSIVE_DELAYS[0] || 0,
    };
  }

  // Increment attempt count
  const newCount = attempt.count + 1;
  const delayMs = PROGRESSIVE_DELAYS[Math.min(newCount - 1, PROGRESSIVE_DELAYS.length - 1)] || 10000;

  if (newCount >= MAX_ATTEMPTS) {
    // Lock the account
    const lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(identifier, {
      ...attempt,
      count: newCount,
      lastAttempt: now,
      lockedUntil,
    });
    return {
      remainingAttempts: 0,
      lockedUntil: new Date(lockedUntil),
      delayMs,
    };
  }

  // Update attempt
  loginAttempts.set(identifier, {
    ...attempt,
    count: newCount,
    lastAttempt: now,
  });

  return {
    remainingAttempts: MAX_ATTEMPTS - newCount,
    delayMs,
  };
}

/**
 * Check if an identifier is currently locked out
 * @param identifier - Email or IP address
 * @returns Lock status
 */
export function isLockedOut(identifier: string): {
  locked: boolean;
  lockedUntil?: Date;
  remainingMs?: number;
} {
  const attempt = loginAttempts.get(identifier);
  
  if (!attempt || !attempt.lockedUntil) {
    return { locked: false };
  }

  const now = Date.now();
  
  if (now >= attempt.lockedUntil) {
    // Lock has expired, clear it
    loginAttempts.delete(identifier);
    return { locked: false };
  }

  return {
    locked: true,
    lockedUntil: new Date(attempt.lockedUntil),
    remainingMs: attempt.lockedUntil - now,
  };
}

/**
 * Clear failed attempts for an identifier (after successful login)
 * @param identifier - Email or IP address
 */
export function clearFailedAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * Get current attempt status
 * @param identifier - Email or IP address
 */
export function getAttemptStatus(identifier: string): {
  attempts: number;
  remainingAttempts: number;
  locked: boolean;
  lockedUntil?: Date;
} {
  const lockStatus = isLockedOut(identifier);
  
  if (lockStatus.locked) {
    return {
      attempts: MAX_ATTEMPTS,
      remainingAttempts: 0,
      locked: true,
      lockedUntil: lockStatus.lockedUntil,
    };
  }

  const attempt = loginAttempts.get(identifier);
  const attempts = attempt?.count || 0;

  return {
    attempts,
    remainingAttempts: MAX_ATTEMPTS - attempts,
    locked: false,
  };
}

/**
 * Cleanup expired entries (run periodically)
 */
export function cleanupExpiredAttempts(): number {
  const now = Date.now();
  let cleaned = 0;

  for (const [identifier, attempt] of loginAttempts.entries()) {
    // Remove if window expired and not locked
    if (!attempt.lockedUntil && now - attempt.firstAttempt > WINDOW_MS) {
      loginAttempts.delete(identifier);
      cleaned++;
      continue;
    }

    // Remove if lock expired
    if (attempt.lockedUntil && now >= attempt.lockedUntil) {
      loginAttempts.delete(identifier);
      cleaned++;
    }
  }

  return cleaned;
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredAttempts, 5 * 60 * 1000);
}
