import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIdentifier } from '@/lib/api/middleware';
import { RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { errors } from '@/lib/api/errors';

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - prevent spam
    const identifier = getClientIdentifier(request);
    if (
      !rateLimit(
        RateLimitIdentifiers.byIP(identifier),
        5, // 5 requests
        60 * 60 * 1000, // per hour
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Log contact form submission (no ContactSubmission model in schema)
    // In production, this would send an email or store in a dedicated system
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      ipAddress: identifier,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send email notification to support team
    // await sendContactNotification(validatedData);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Your message has been received. We will get back to you soon.',
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid data', details: error.issues } },
        { status: 400 }
      );
    }

    if ((error as any).code === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' } },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to submit contact form' } },
      { status: 500 }
    );
  }
}
