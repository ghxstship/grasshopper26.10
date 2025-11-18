/**
 * Email Service
 * Handles email sending via SendGrid
 */

import sgMail from '@sendgrid/mail';
import { BaseService, ServiceResult } from '../base/BaseService';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
  from?: string;
}

export class EmailService extends BaseService {
  private readonly defaultFrom = process.env.SENDGRID_FROM_EMAIL || 'noreply@gvteway.com';

  /**
   * Send an email
   */
  async send(input: SendEmailInput): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      if (!process.env.SENDGRID_API_KEY) {
        console.warn('[EmailService] SendGrid API key not configured');
        return;
      }

      const msg = {
        to: input.to,
        from: input.from || this.defaultFrom,
        subject: input.subject,
        ...(input.text && { text: input.text }),
        ...(input.html && { html: input.html }),
        ...(input.templateId && {
          templateId: input.templateId,
          dynamicTemplateData: input.dynamicTemplateData,
        }),
      };

      await sgMail.send(msg as sgMail.MailDataRequired);

      console.log(`[EmailService] Email sent to ${input.to}`);
    }, 'send');
  }

  /**
   * Send welcome email
   */
  async sendWelcome(to: string, name: string): Promise<ServiceResult<void>> {
    return this.send({
      to,
      subject: 'Welcome to GVTEWAY',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining GVTEWAY. We're excited to have you on board.</p>
        <p>Get started by exploring upcoming events and connecting with the community.</p>
      `,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(to: string, resetToken: string): Promise<ServiceResult<void>> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    return this.send({
      to,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(to: string, verificationToken: string): Promise<ServiceResult<void>> {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`;

    return this.send({
      to,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  }

  /**
   * Send order confirmation
   */
  async sendOrderConfirmation(to: string, orderDetails: Record<string, unknown>): Promise<ServiceResult<void>> {
    return this.send({
      to,
      subject: 'Order Confirmation',
      html: `
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order. Here are the details:</p>
        <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
      `,
    });
  }

  /**
   * Send ticket delivery email
   */
  async sendTicketDelivery(to: string, ticketDetails: Record<string, unknown>): Promise<ServiceResult<void>> {
    return this.send({
      to,
      subject: 'Your Tickets Are Ready!',
      html: `
        <h1>Your Tickets</h1>
        <p>Your tickets are ready! Access them in your account or use the links below:</p>
        <pre>${JSON.stringify(ticketDetails, null, 2)}</pre>
      `,
    });
  }

  /**
   * Send advancing request notification
   */
  async sendAdvancingNotification(
    to: string,
    requestTitle: string,
    status: string
  ): Promise<ServiceResult<void>> {
    return this.send({
      to,
      subject: `Advancing Request ${status}: ${requestTitle}`,
      html: `
        <h1>Advancing Request Update</h1>
        <p>Your advancing request "${requestTitle}" has been ${status.toLowerCase()}.</p>
        <p>Log in to view details and next steps.</p>
      `,
    });
  }
}
