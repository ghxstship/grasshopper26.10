import { NextRequest } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, rateLimit, getClientIdentifier } from '@/lib/api/middleware';
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { LoginService } from "@/lib/services/auth/login.service";



export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    const identifier = getClientIdentifier(request);
    if (!rateLimit(`login:${identifier}`, 5, 900000)) {
      // 5 attempts per 15 minutes
      throw errors.rateLimitExceeded();
    }

    // Parse and validate request body
    const body = await parseBody(request);
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await new LoginService().findUserByEmail(validatedData.email);

    if (!user || !user.password) {
      throw errors.unauthorized();
    }

    // Verify password
    const isValidPassword = await new LoginService().verifyPassword(validatedData.password, user.password);

    if (!isValidPassword) {
      throw errors.unauthorized();
    }

    // Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: expiresAt,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return successResponse({
      user: userWithoutPassword,
      sessionToken,
      expiresAt: expiresAt.toISOString(),
      message: 'Login successful',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
