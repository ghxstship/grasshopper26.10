import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return predefined automation templates
    const templates = [
      {
        id: 'notify-on-status-change',
        name: 'Notify on Status Change',
        description: 'Send notifications when request status changes',
        category: 'notifications',
        config: {
          trigger: 'status_change',
          actions: ['send_email', 'send_notification'],
        },
      },
      {
        id: 'auto-approve-low-priority',
        name: 'Auto-approve Low Priority Requests',
        description: 'Automatically approve requests below a certain threshold',
        category: 'approvals',
        config: {
          trigger: 'request_created',
          conditions: [{ field: 'priority', operator: 'equals', value: 'LOW' }],
          actions: ['approve_request'],
        },
      },
      {
        id: 'escalate-overdue',
        name: 'Escalate Overdue Requests',
        description: 'Escalate requests that are past their due date',
        category: 'escalations',
        config: {
          trigger: 'schedule',
          schedule: '0 9 * * *', // Daily at 9 AM
          conditions: [{ field: 'dueDate', operator: 'less_than', value: 'now' }],
          actions: ['send_escalation_email'],
        },
      },
    ];

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error getting automation templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
