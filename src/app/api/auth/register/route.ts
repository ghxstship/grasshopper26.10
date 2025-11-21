import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';
import { createdResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, rateLimit } from '@/lib/api/middleware';
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { prisma } from '@/lib/prisma';
import { getClientIdentifier } from '@/lib/api/middleware';



export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    const identifier = getClientIdentifier(request);
    if (!rateLimit(`register:${identifier}`, 5, 3600000)) {
      throw errors.rateLimitExceeded();
    }

    // Parse and validate request body
    const body = await parseBody(request);
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw errors.conflict('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        role: validatedData.role || 'CONSUMER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate verification token and store in user metadata
    const verificationToken = crypto.randomUUID();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: tokenExpires,
      },
    });

    // Send verification email
    try {
      const { sendEmail } = await import('@/lib/integrations/communication/sendgrid');
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        html: `
          <h1>Welcome to GVTEWAY!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch {
      // Email sending failed - registration still successful
      // Production: Log to monitoring service
    }

    return createdResponse({
      user,
      message: 'Registration successful. Please check your email for verification.',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
