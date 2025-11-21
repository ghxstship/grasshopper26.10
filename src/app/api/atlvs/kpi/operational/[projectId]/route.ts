import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleApiError } from '@/lib/api/response';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const supabase = await createClient();
    const { projectId } = await params;

    // Calculate operational KPIs
    const [
      { data: timelineAdherence },
      { data: taskCompletion },
      { data: staffUtilization },
      { data: budgetVariance }
    ] = await Promise.all([
      supabase.rpc('calculate_timeline_adherence', { p_project_id: projectId }),
      supabase.rpc('calculate_task_completion_rate', { p_project_id: projectId }),
      supabase.rpc('calculate_staff_utilization', { p_project_id: projectId }),
      supabase.rpc('calculate_budget_variance', { p_project_id: projectId })
    ]);

    const kpis = {
      timeline_adherence: timelineAdherence || 0,
      task_completion_rate: taskCompletion || 0,
      staff_utilization: staffUtilization || 0,
      budget_variance: budgetVariance || 0,
    };

    return NextResponse.json(kpis);
  } catch (error) {
    return handleApiError(error);
  }
}
