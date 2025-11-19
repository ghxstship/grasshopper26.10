/**
 * Animation & Transition Tokens
 * GHXSTSHIP animations are bold, precise, and purposeful
 * Hard cuts over fades, geometric motion, scale for impact
 */

export const animations = {
  // Duration Values
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '250ms',
    normal: '300ms',
    slow: '400ms',
    slower: '600ms',
    slowest: '1000ms',
  },
  
  // Easing Functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  
  // Delay Values
  delay: {
    none: '0ms',
    short: '75ms',
    base: '150ms',
    long: '300ms',
  },
} as const;

/**
 * Keyframe Animations
 * Pre-defined animation patterns for common use cases
 */
export const keyframes = {
  // Fade animations
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  
  fadeOut: {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  
  // Slide animations
  slideInFromTop: {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  },
  
  slideInFromBottom: {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
  
  slideInFromLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },
  
  slideInFromRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },
  
  // Scale animations
  scaleIn: {
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(1)' },
  },
  
  scaleOut: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(0)' },
  },
  
  // Wipe animations (hard cuts)
  wipeRight: {
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0 0 0)' },
  },
  
  wipeLeft: {
    from: { clipPath: 'inset(0 0 0 100%)' },
    to: { clipPath: 'inset(0 0 0 0)' },
  },
  
  wipeDown: {
    from: { clipPath: 'inset(0 0 100% 0)' },
    to: { clipPath: 'inset(0 0 0 0)' },
  },
  
  wipeUp: {
    from: { clipPath: 'inset(100% 0 0 0)' },
    to: { clipPath: 'inset(0 0 0 0)' },
  },
  
  // Spin animation
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  
  // Pulse animation
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
} as const;

export type Animations = typeof animations;
export type Keyframes = typeof keyframes;
