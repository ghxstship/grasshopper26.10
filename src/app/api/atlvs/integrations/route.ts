import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleApiError } from '@/lib/api/response';



export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: integrations, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      throw error;
    }

    // Map database fields to frontend format
    const formattedIntegrations = (integrations || []).map((integration: {
      id: string;
      name: string;
      description: string;
      icon_name?: string;
      connected: boolean;
      status?: string;
      last_sync_at?: string;
      settings?: Record<string, unknown>;
    }) => ({
      id: integration.id,
      name: integration.name,
      description: integration.description,
      icon: integration.icon_name || 'Zap',
      connected: integration.connected,
      href: `/atlvs/integrations/${integration.id}`,
      status: integration.status,
      lastSync: integration.last_sync_at,
      settings: integration.settings,
    }));

    return NextResponse.json(formattedIntegrations);
  } catch (error) {
    return handleApiError(error);
  }
}
