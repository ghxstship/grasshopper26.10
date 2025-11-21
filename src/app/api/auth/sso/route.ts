import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ssoSchema = z.object({
  provider: z.enum(['google', 'microsoft', 'okta', 'auth0']),
  domain: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = ssoSchema.parse(body);

    // SSO configuration endpoint
    // In production, this would integrate with actual SSO providers
    const ssoConfig = {
      provider: data.provider,
      redirectUrl: `/api/auth/callback/${data.provider}`,
      configured: false,
    };

    return NextResponse.json({
      success: true,
      data: { ssoConfig },
    });
  } catch (error) {
    console.error('SSO config error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to configure SSO' } },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    // Get SSO configuration status
    return NextResponse.json({
      success: true,
      data: {
        providers: [
          { name: 'google', enabled: true },
          { name: 'microsoft', enabled: false },
          { name: 'okta', enabled: false },
          { name: 'auth0', enabled: false },
        ],
      },
    });
  } catch (error) {
    console.error('SSO status error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch SSO status' } },
      { status: 500 }
    );
  }
}
