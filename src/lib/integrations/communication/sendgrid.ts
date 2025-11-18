/**
 * SendGrid email integration
 */

import { validateEnvVars, createSuccessResponse, createErrorResponse } from '../utils';
import type { IntegrationResponse } from '../types';
import type { EmailPayload } from '../types';

/**
 * Send email via SendGrid
 */
export async function sendEmail(
  payload: EmailPayload
): Promise<IntegrationResponse<{ messageId: string }>> {
  try {
    validateEnvVars({
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    });

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: Array.isArray(payload.to)
              ? payload.to.map(email => ({ email }))
              : [{ email: payload.to }],
            dynamic_template_data: payload.dynamicData,
          },
        ],
        from: {
          email: payload.from || process.env.SENDGRID_FROM_EMAIL,
        },
        subject: payload.subject,
        content: payload.html
          ? [{ type: 'text/html', value: payload.html }]
          : payload.text
          ? [{ type: 'text/plain', value: payload.text }]
          : undefined,
        template_id: payload.templateId,
        attachments: payload.attachments?.map(att => ({
          content: typeof att.content === 'string' 
            ? att.content 
            : att.content.toString('base64'),
          filename: att.filename,
          type: att.type || 'application/octet-stream',
          disposition: 'attachment',
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`SendGrid API error: ${JSON.stringify(error)}`);
    }

    const messageId = response.headers.get('x-message-id') || 'unknown';

    return createSuccessResponse({ messageId });
  } catch (error) {
    return createErrorResponse(
      'SENDGRID_EMAIL_ERROR',
      error instanceof Error ? error.message : 'Failed to send email',
      error
    );
  }
}

/**
 * Send transactional email with template
 */
export async function sendTemplateEmail(
  to: string | string[],
  templateId: string,
  dynamicData: Record<string, unknown>
): Promise<IntegrationResponse<{ messageId: string }>> {
  return sendEmail({
    to,
    subject: '', // Subject is in template
    templateId,
    dynamicData,
  });
}

/**
 * Send event confirmation email
 */
export async function sendEventConfirmation(
  to: string,
  eventName: string,
  eventDate: string,
  ticketNumber: string,
  qrCodeUrl: string
): Promise<IntegrationResponse<{ messageId: string }>> {
  return sendTemplateEmail(to, process.env.SENDGRID_EVENT_CONFIRMATION_TEMPLATE_ID || '', {
    eventName,
    eventDate,
    ticketNumber,
    qrCodeUrl,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(
  to: string,
  resetLink: string
): Promise<IntegrationResponse<{ messageId: string }>> {
  return sendTemplateEmail(to, process.env.SENDGRID_PASSWORD_RESET_TEMPLATE_ID || '', {
    resetLink,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<IntegrationResponse<{ messageId: string }>> {
  return sendTemplateEmail(to, process.env.SENDGRID_WELCOME_TEMPLATE_ID || '', {
    name,
  });
}

/**
 * Send notification email
 */
export async function sendNotification(
  to: string,
  subject: string,
  message: string
): Promise<IntegrationResponse<{ messageId: string }>> {
  return sendEmail({
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">${subject}</h2>
        <p style="color: #333; line-height: 1.6;">${message}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated message from GVTEWAY. Please do not reply to this email.
        </p>
      </div>
    `,
  });
}

/**
 * Send bulk emails
 */
export async function sendBulkEmails(
  emails: Array<{
    to: string;
    subject: string;
    html?: string;
    text?: string;
    templateId?: string;
    dynamicData?: Record<string, unknown>;
  }>
): Promise<IntegrationResponse<{ sent: number; failed: number }>> {
  try {
    const results = await Promise.allSettled(
      emails.map(email => sendEmail(email))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return createSuccessResponse({ sent, failed });
  } catch (error) {
    return createErrorResponse(
      'SENDGRID_BULK_EMAIL_ERROR',
      error instanceof Error ? error.message : 'Failed to send bulk emails',
      error
    );
  }
}
