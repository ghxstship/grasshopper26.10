/**
 * SMS Service
 * Handles SMS notifications via Twilio
 */

import { Twilio } from 'twilio';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

export class SMSService {
  /**
   * Send SMS message
   */
  async sendSMS(to: string, message: string) {
    try {
      if (!twilioClient) {
        console.warn('Twilio not configured, skipping SMS');
        return { success: false, error: 'SMS service not configured' };
      }

      const result = await twilioClient.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to,
      });

      return {
        success: true,
        messageId: result.sid,
        status: result.status,
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send verification code
   */
  async sendVerificationCode(phoneNumber: string, code: string) {
    const message = `Your verification code is: ${code}. This code will expire in 10 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send order confirmation
   */
  async sendOrderConfirmation(phoneNumber: string, orderNumber: string) {
    const message = `Your order ${orderNumber} has been confirmed. Thank you for your purchase!`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send ticket reminder
   */
  async sendTicketReminder(phoneNumber: string, eventName: string, eventDate: string) {
    const message = `Reminder: ${eventName} is coming up on ${eventDate}. See you there!`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(recipients: string[], message: string) {
    try {
      const results = await Promise.allSettled(
        recipients.map((phoneNumber) => this.sendSMS(phoneNumber, message))
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      return {
        total: recipients.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      console.error('Error sending bulk SMS:', error);
      throw error;
    }
  }

  /**
   * Get SMS delivery status
   */
  async getSMSStatus(messageId: string) {
    try {
      if (!twilioClient) {
        throw new Error('Twilio not configured');
      }

      const message = await twilioClient.messages(messageId).fetch();

      return {
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        dateCreated: message.dateCreated,
        dateSent: message.dateSent,
        dateUpdated: message.dateUpdated,
      };
    } catch (error) {
      console.error('Error fetching SMS status:', error);
      throw error;
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Basic E.164 format validation
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }

  /**
   * Format phone number to E.164
   */
  formatPhoneNumber(phoneNumber: string, countryCode = '+1'): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');

    // Add country code if not present
    if (!phoneNumber.startsWith('+')) {
      return `${countryCode}${digits}`;
    }

    return `+${digits}`;
  }
}

export const smsService = new SMSService();
