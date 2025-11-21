/**
 * BatchService for Email Processing
 * Business logic for /batch/emails
 */

import { prisma } from '@/lib/prisma';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export class BatchService {
  // Email queue operations
  async findAll(filters?: any) {
    return await prisma.emailQueue.findMany(filters);
  }

  async findById(params: { where: { id: string } }) {
    return await prisma.emailQueue.findUnique(params);
  }

  async create(params: { data: any }) {
    return await prisma.emailQueue.create(params);
  }

  async update(params: { where: { id: string }; data: any }) {
    return await prisma.emailQueue.update(params);
  }

  async delete(id: string) {
    return await prisma.emailQueue.delete({ where: { id } });
  }

  // Batch job operations
  async createBatchJob(params: { data: any }) {
    return await prisma.batchJob.create(params);
  }

  async updateBatchJob(params: { where: { id: string }; data: any }) {
    return await prisma.batchJob.update(params);
  }

  async getBatchJob(id: string) {
    return await prisma.batchJob.findUnique({ where: { id } });
  }

  // Email sending operations
  async sendEmail(email: {
    to: string;
    from?: string;
    subject: string;
    html?: string;
    text?: string;
  }) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.warn('[Email] SendGrid API key not configured, skipping send');
        return { success: false, error: 'Email service not configured' };
      }

      const msg = {
        to: email.to,
        from: email.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@grasshopper.com',
        subject: email.subject,
        text: email.text,
        html: email.html,
      };

      await sgMail.send(msg);
      
      return { success: true };
    } catch (error) {
      console.error('[Email] Error sending email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  }

  // Process email queue
  async processQueue(limit: number = 10) {
    const pendingEmails = await prisma.emailQueue.findMany({
      where: {
        status: 'pending',
        attempts: { lt: 3 },
        OR: [
          { scheduledFor: null },
          { scheduledFor: { lte: new Date() } },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    const results = [];

    for (const email of pendingEmails) {
      try {
        await this.sendEmail({
          to: email.to,
          from: email.from || undefined,
          subject: email.subject,
          html: email.html || undefined,
          text: email.text || undefined,
        });

        await prisma.emailQueue.update({
          where: { id: email.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
          },
        });

        results.push({ id: email.id, success: true });
      } catch (error) {
        const attempts = email.attempts + 1;
        const status = attempts >= email.maxAttempts ? 'failed' : 'pending';

        await prisma.emailQueue.update({
          where: { id: email.id },
          data: {
            attempts,
            status,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });

        results.push({
          id: email.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }
}
