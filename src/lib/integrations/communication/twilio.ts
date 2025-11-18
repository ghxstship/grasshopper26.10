/**
 * Twilio SMS integration
 */

import { validateEnvVars, createSuccessResponse, createErrorResponse, formatPhoneNumber } from '../utils';
import type { IntegrationResponse } from '../types';
import type { SMSPayload } from '../types';

/**
 * Send SMS via Twilio
 */
export async function sendSMS(
  payload: SMSPayload
): Promise<IntegrationResponse<{ sid: string; status: string }>> {
  try {
    validateEnvVars({
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    });

    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const fromNumber = payload.from || process.env.TWILIO_PHONE_NUMBER!;

    // Format phone numbers
    const to = formatPhoneNumber(payload.to);
    const from = formatPhoneNumber(fromNumber);

    // Create form data
    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', from);
    formData.append('Body', payload.body);
    
    if (payload.mediaUrls && payload.mediaUrls.length > 0) {
      payload.mediaUrls.forEach(url => {
        formData.append('MediaUrl', url);
      });
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twilio API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    return createSuccessResponse({
      sid: data.sid,
      status: data.status,
    });
  } catch (error) {
    return createErrorResponse(
      'TWILIO_SMS_ERROR',
      error instanceof Error ? error.message : 'Failed to send SMS',
      error
    );
  }
}

/**
 * Send event reminder SMS
 */
export async function sendEventReminder(
  to: string,
  eventName: string,
  eventDate: string,
  venue: string
): Promise<IntegrationResponse<{ sid: string; status: string }>> {
  return sendSMS({
    to,
    body: `Reminder: ${eventName} at ${venue} on ${eventDate}. See you there! - GVTEWAY`,
  });
}

/**
 * Send ticket confirmation SMS
 */
export async function sendTicketConfirmation(
  to: string,
  eventName: string,
  ticketNumber: string
): Promise<IntegrationResponse<{ sid: string; status: string }>> {
  return sendSMS({
    to,
    body: `Your ticket for ${eventName} is confirmed! Ticket #${ticketNumber}. Check your email for details. - GVTEWAY`,
  });
}

/**
 * Send verification code SMS
 */
export async function sendVerificationCode(
  to: string,
  code: string
): Promise<IntegrationResponse<{ sid: string; status: string }>> {
  return sendSMS({
    to,
    body: `Your GVTEWAY verification code is: ${code}. This code will expire in 10 minutes.`,
  });
}

/**
 * Send alert SMS
 */
export async function sendAlert(
  to: string,
  message: string
): Promise<IntegrationResponse<{ sid: string; status: string }>> {
  return sendSMS({
    to,
    body: `ALERT: ${message} - GVTEWAY`,
  });
}

/**
 * Send bulk SMS messages
 */
export async function sendBulkSMS(
  messages: Array<{ to: string; body: string; mediaUrls?: string[] }>
): Promise<IntegrationResponse<{ sent: number; failed: number }>> {
  try {
    const results = await Promise.allSettled(
      messages.map(msg => sendSMS(msg))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return createSuccessResponse({ sent, failed });
  } catch (error) {
    return createErrorResponse(
      'TWILIO_BULK_SMS_ERROR',
      error instanceof Error ? error.message : 'Failed to send bulk SMS',
      error
    );
  }
}

/**
 * Get message status
 */
export async function getMessageStatus(
  messageSid: string
): Promise<IntegrationResponse<{ status: string; errorCode?: string; errorMessage?: string }>> {
  try {
    validateEnvVars({
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    });

    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages/${messageSid}.json`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twilio API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    return createSuccessResponse({
      status: data.status,
      errorCode: data.error_code,
      errorMessage: data.error_message,
    });
  } catch (error) {
    return createErrorResponse(
      'TWILIO_STATUS_ERROR',
      error instanceof Error ? error.message : 'Failed to get message status',
      error
    );
  }
}
