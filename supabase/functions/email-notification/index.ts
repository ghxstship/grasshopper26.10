/**
 * Email Notification Edge Function
 * Sends transactional emails via SendGrid
 * Handles various email templates and queuing
 */

/// <reference types="https://deno.land/x/types/index.d.ts" />

interface EmailRequest {
  to: string;
  template: string;
  data: Record<string, unknown>;
  priority?: 'high' | 'normal' | 'low';
}

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'noreply@gvteway.com';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // Parse request body
    const emailRequest: EmailRequest = await req.json();

    // Validate request
    if (!emailRequest.to || !emailRequest.template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, template' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get email template
    const emailContent = getEmailTemplate(emailRequest.template, emailRequest.data);

    if (!emailContent) {
      return new Response(
        JSON.stringify({ error: 'Email template not found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email via SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailRequest.to }],
            dynamic_template_data: emailRequest.data,
          },
        ],
        from: { email: FROM_EMAIL, name: 'GVTEWAY' },
        subject: emailContent.subject,
        content: [
          {
            type: 'text/html',
            value: emailContent.html,
          },
        ],
      }),
    });

    if (!sendGridResponse.ok) {
      const error = await sendGridResponse.text();
      console.error('SendGrid error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        sent: true,
        to: emailRequest.to,
        template: emailRequest.template,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Get email template content
 */
function getEmailTemplate(
  template: string,
  data: Record<string, unknown>
): { subject: string; html: string } | null {
  const templates: Record<string, (data: Record<string, unknown>) => { subject: string; html: string }> = {
    'welcome': (data) => ({
      subject: 'Welcome to GVTEWAY!',
      html: `
        <h1>Welcome ${data.name}!</h1>
        <p>Thank you for joining GVTEWAY. We're excited to have you on board.</p>
        <p>Get started by exploring upcoming events in your area.</p>
      `,
    }),
    'ticket-confirmation': (data) => ({
      subject: `Your tickets for ${data.eventName}`,
      html: `
        <h1>Ticket Confirmation</h1>
        <p>Your tickets for <strong>${data.eventName}</strong> have been confirmed!</p>
        <p>Event Date: ${data.eventDate}</p>
        <p>Quantity: ${data.quantity}</p>
        <p>Order ID: ${data.orderId}</p>
      `,
    }),
    'password-reset': (data) => ({
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${data.resetLink}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    }),
    'advancing-approved': (data) => ({
      subject: `Advancing Request Approved: ${data.requestTitle}`,
      html: `
        <h1>Request Approved</h1>
        <p>Your advancing request <strong>${data.requestTitle}</strong> has been approved.</p>
        <p>Approved by: ${data.approvedBy}</p>
        <p>Comments: ${data.comments || 'None'}</p>
      `,
    }),
  };

  const templateFn = templates[template];
  return templateFn ? templateFn(data) : null;
}
