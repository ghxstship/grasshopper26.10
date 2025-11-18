import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  organizationName: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  dateFormat: z.string().optional(),
  currency: z.string().optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
  }).optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  twoFactorEnabled: z.boolean().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no settings exist, return defaults
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          id: crypto.randomUUID(),
          userId: user.id,
          organizationName: 'ATLVS Productions',
          timezone: 'America/Los_Angeles',
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          currency: 'USD',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          theme: 'dark',
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      throw error;
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateSettingsSchema.parse(body);

    const { data: settings, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
