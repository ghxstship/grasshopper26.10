import { AdvancingStatus, Priority } from '@prisma/client';
import { AuditService } from '@/lib/services/shared/audit.service';
import { prisma } from '@/lib/prisma';

export interface NotificationRecipient {
  userId: string;
  email: string;
  name: string;
}

export interface StatusChangeNotification {
  requestId: string;
  requestTitle: string;
  oldStatus: AdvancingStatus;
  newStatus: AdvancingStatus;
  changedBy: string;
  note?: string;
  recipients: NotificationRecipient[];
}

export interface CommentNotification {
  requestId: string;
  requestTitle: string;
  commentAuthor: string;
  commentContent: string;
  recipients: NotificationRecipient[];
}

export interface AssignmentNotification {
  requestId: string;
  requestTitle: string;
  assignedTo: NotificationRecipient;
  assignedBy: string;
}

/**
 * Service for handling notifications related to advancing requests
 * Integrates with email service and in-app notifications
 */
export class NotificationService {
  private prisma = prisma;
  // TODO: Integrate EmailService and RealtimeService when available
  // private emailService: EmailService;
  // private realtimeService: RealtimeService;

  /**
   * Send notification when status changes
   */
  async notifyStatusChange(notification: StatusChangeNotification): Promise<void> {
    const { requestId, requestTitle, oldStatus, newStatus, changedBy, note, recipients } = notification;

    // Log to audit
    await AuditService.log({
      action: 'notification_sent',
      entity: 'AdvancingRequest',
      entityId: requestId,
      metadata: {
        type: 'status_change',
        oldStatus,
        newStatus,
        recipientCount: recipients.length,
      },
    });

    // Integrate with SendGrid email service
    const { EmailService } = await import('../../shared/EmailService');
    const emailService = new EmailService();

    for (const recipient of recipients) {
      await emailService.send({
        to: recipient.email,
        subject: `Status Update: ${requestTitle}`,
        html: `
          <h2>Advancing Request Status Changed</h2>
          <p>Hello ${recipient.name},</p>
          <p>The status of "${requestTitle}" has been updated:</p>
          <p><strong>Previous Status:</strong> ${oldStatus}</p>
          <p><strong>New Status:</strong> ${newStatus}</p>
          <p><strong>Changed By:</strong> ${changedBy}</p>
          ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/atlvs/advancing/${requestId}">View Request</a></p>
        `,
      }).catch(err => console.error('Failed to send status change email:', err));
    }

    // Create in-app notifications in database
    const { NotificationService } = await import('../../shared/NotificationService');
    const notificationService = new NotificationService();

    for (const recipient of recipients) {
      await notificationService.create({
        userId: recipient.userId,
        title: `Request status changed: ${requestTitle}`,
        message: `Status changed from ${oldStatus} to ${newStatus}${note ? ` - ${note}` : ''}`,
        type: 'status_change',
        actionUrl: `/atlvs/advancing/${requestId}`,
        metadata: { requestId, oldStatus, newStatus, changedBy },
      });
    }
  }

  /**
   * Send notification when comment is added
   */
  async notifyNewComment(notification: CommentNotification): Promise<void> {
    const { requestId, requestTitle, commentAuthor, commentContent, recipients } = notification;

    // Log to audit
    await AuditService.log({
      action: 'notification_sent',
      entity: 'AdvancingRequest',
      entityId: requestId,
      metadata: {
        type: 'new_comment',
        author: commentAuthor,
        recipientCount: recipients.length,
      },
    });

    // Integrate with SendGrid email service
    const { EmailService } = await import('../../shared/EmailService');
    const emailService = new EmailService();

    for (const recipient of recipients) {
      await emailService.send({
        to: recipient.email,
        subject: `New Comment: ${requestTitle}`,
        html: `
          <h2>New Comment on Advancing Request</h2>
          <p>Hello ${recipient.name},</p>
          <p>${commentAuthor} commented on "${requestTitle}":</p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; margin: 10px 0;">
            ${commentContent.substring(0, 200)}${commentContent.length > 200 ? '...' : ''}
          </blockquote>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/atlvs/advancing/${requestId}">View Request</a></p>
        `,
      }).catch(err => console.error('Failed to send comment email:', err));
    }

    // Create in-app notifications
    const { NotificationService } = await import('../../shared/NotificationService');
    const notificationService = new NotificationService();

    for (const recipient of recipients) {
      await notificationService.create({
        userId: recipient.userId,
        title: `New comment on: ${requestTitle}`,
        message: `${commentAuthor} commented: ${commentContent.substring(0, 100)}${commentContent.length > 100 ? '...' : ''}`,
        type: 'new_comment',
        actionUrl: `/atlvs/advancing/${requestId}`,
        metadata: { requestId, commentAuthor },
      });
    }
  }

  /**
   * Send notification when request is assigned
   */
  async notifyAssignment(notification: AssignmentNotification): Promise<void> {
    const { requestId, requestTitle, assignedTo, assignedBy } = notification;

    // Log to audit
    await AuditService.log({
      action: 'notification_sent',
      entity: 'AdvancingRequest',
      entityId: requestId,
      metadata: {
        type: 'assignment',
        assignedTo: assignedTo.userId,
        assignedBy,
      },
    });

    // Integrate with SendGrid
    const { EmailService } = await import('../../shared/EmailService');
    const emailService = new EmailService();

    await emailService.send({
      to: assignedTo.email,
      subject: `You've been assigned: ${requestTitle}`,
      html: `
        <h2>New Assignment</h2>
        <p>Hello ${assignedTo.name},</p>
        <p>You have been assigned to the advancing request "${requestTitle}" by ${assignedBy}.</p>
        <p>Please review and take action as needed.</p>
      `,
    }).catch(err => console.error('Failed to send assignment email:', err));
  }

  /**
   * Send notification for due date reminders
   */
  async notifyDueDateReminder(
    requestId: string,
    requestTitle: string,
    dueDate: Date,
    recipients: NotificationRecipient[]
  ): Promise<void> {
    // Log to audit
    await AuditService.log({
      action: 'notification_sent',
      entity: 'AdvancingRequest',
      entityId: requestId,
      metadata: {
        type: 'due_date_reminder',
        dueDate: dueDate.toISOString(),
        recipientCount: recipients.length,
      },
    });

    // Integrate with SendGrid
    const { EmailService } = await import('../../shared/EmailService');
    const emailService = new EmailService();

    for (const recipient of recipients) {
      await emailService.send({
        to: recipient.email,
        subject: `Reminder: ${requestTitle} due soon`,
        html: `
          <h2>Due Date Reminder</h2>
          <p>Hello ${recipient.name},</p>
          <p>The advancing request "${requestTitle}" is due on ${dueDate.toLocaleDateString()}.</p>
          <p>Please ensure all required actions are completed on time.</p>
        `,
      }).catch(err => console.error('Failed to send due date email:', err));
    }
  }

  /**
   * Send notification for urgent priority requests
   */
  async notifyUrgentRequest(
    requestId: string,
    requestTitle: string,
    priority: Priority,
    recipients: NotificationRecipient[]
  ): Promise<void> {
    if (priority !== Priority.URGENT) {
      return;
    }

    // Log to audit
    await AuditService.log({
      action: 'notification_sent',
      entity: 'AdvancingRequest',
      entityId: requestId,
      metadata: {
        type: 'urgent_request',
        priority,
        recipientCount: recipients.length,
      },
    });

    // Integrate with SendGrid
    const { EmailService } = await import('../../shared/EmailService');
    const emailService = new EmailService();

    for (const recipient of recipients) {
      await emailService.send({
        to: recipient.email,
        subject: `URGENT: ${requestTitle}`,
        html: `
          <h2 style="color: red;">Urgent Request</h2>
          <p>Hello ${recipient.name},</p>
          <p>An urgent advancing request requires your immediate attention:</p>
          <p><strong>${requestTitle}</strong></p>
          <p><strong>Priority:</strong> ${priority}</p>
          <p>Please review and respond as soon as possible.</p>
        `,
      }).catch(err => console.error('Failed to send urgent email:', err));
    }
  }

  /**
   * Get notification preferences for a user
   */
  async getUserNotificationPreferences(userId: string): Promise<{
    email: boolean;
    inApp: boolean;
    statusChanges: boolean;
    comments: boolean;
    assignments: boolean;
    dueDateReminders: boolean;
  }> {
    const prefs = await this.prisma.notificationPreferences.findUnique({ where: { userId } });

    return {
      email: prefs?.email !== false,
      inApp: prefs?.inApp !== false,
      statusChanges: prefs?.statusChanges !== false,
      comments: prefs?.comments !== false,
      assignments: prefs?.assignments !== false,
      dueDateReminders: prefs?.dueDateReminders !== false,
    };
  }

  /**
   * Update notification preferences for a user
   */
  async updateUserNotificationPreferences(
    userId: string,
    preferences: Partial<{
      email: boolean;
      inApp: boolean;
      statusChanges: boolean;
      comments: boolean;
      assignments: boolean;
      dueDateReminders: boolean;
    }>
  ): Promise<void> {
    // Save to database - NotificationPreferences model exists in schema
    await this.prisma.notificationPreferences.upsert({
      where: { userId },
      update: preferences,
      create: { userId, ...preferences },
    });
  }
}
