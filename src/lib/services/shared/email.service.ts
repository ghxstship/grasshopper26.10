/**
 * Email Service
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  static async sendOrderConfirmation(params: {
    to: string;
    orderNumber: string;
    eventName: string;
    ticketCount: number;
    total: number;
  }) {
    await resend.emails.send({
      from: 'orders@gvteway.com',
      to: params.to,
      subject: `Order Confirmation - ${params.orderNumber}`,
      html: `
        <h1>Order Confirmed!</h1>
        <p>Your order ${params.orderNumber} has been confirmed.</p>
        <p>Event: ${params.eventName}</p>
        <p>Tickets: ${params.ticketCount}</p>
        <p>Total: $${params.total}</p>
      `,
    });
  }

  static async sendTickets(params: {
    to: string;
    eventName: string;
    tickets: Array<{ qrCode: string; seatNumber?: string }>;
  }) {
    await resend.emails.send({
      from: 'tickets@gvteway.com',
      to: params.to,
      subject: `Your Tickets - ${params.eventName}`,
      html: `
        <h1>Your Tickets</h1>
        <p>Event: ${params.eventName}</p>
        <p>Number of tickets: ${params.tickets.length}</p>
      `,
    });
  }

  static async sendEventReminder(params: {
    to: string;
    eventName: string;
    eventDate: Date;
    venueName: string;
  }) {
    await resend.emails.send({
      from: 'events@gvteway.com',
      to: params.to,
      subject: `Event Reminder - ${params.eventName}`,
      html: `
        <h1>Event Reminder</h1>
        <p>${params.eventName} is coming up!</p>
        <p>Date: ${params.eventDate.toLocaleDateString()}</p>
        <p>Venue: ${params.venueName}</p>
      `,
    });
  }

  static async sendPasswordReset(params: {
    to: string;
    resetToken: string;
  }) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${params.resetToken}`;
    
    await resend.emails.send({
      from: 'auth@gvteway.com',
      to: params.to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    });
  }

  static async sendWelcome(params: {
    to: string;
    name: string;
  }) {
    await resend.emails.send({
      from: 'welcome@gvteway.com',
      to: params.to,
      subject: 'Welcome to GVTEWAY!',
      html: `
        <h1>Welcome ${params.name}!</h1>
        <p>Thank you for joining GVTEWAY.</p>
      `,
    });
  }

  static async sendAdvancingApproval(params: {
    to: string;
    category: string;
    requestId: string;
  }) {
    await resend.emails.send({
      from: 'advancing@atlvs.com',
      to: params.to,
      subject: 'Advancing Request Approved',
      html: `
        <h1>Request Approved</h1>
        <p>Your ${params.category} advancing request has been approved.</p>
      `,
    });
  }

  static async sendExpenseApproval(params: {
    to: string;
    amount: number;
    description: string;
  }) {
    await resend.emails.send({
      from: 'expenses@atlvs.com',
      to: params.to,
      subject: 'Expense Approved',
      html: `
        <h1>Expense Approved</h1>
        <p>Your expense of $${params.amount} has been approved.</p>
        <p>Description: ${params.description}</p>
      `,
    });
  }

  static async sendTaskAssignment(params: {
    to: string;
    taskName: string;
    projectName: string;
    dueDate?: Date;
  }) {
    await resend.emails.send({
      from: 'tasks@atlvs.com',
      to: params.to,
      subject: `Task Assigned - ${params.taskName}`,
      html: `
        <h1>New Task Assignment</h1>
        <p>You have been assigned to: ${params.taskName}</p>
        <p>Project: ${params.projectName}</p>
        ${params.dueDate ? `<p>Due: ${params.dueDate.toLocaleDateString()}</p>` : ''}
      `,
    });
  }
}
