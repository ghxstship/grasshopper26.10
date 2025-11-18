/**
 * GVTEWAY Alert Service
 * Handles price alerts and notifications for consumer platform
 */

import { BaseService, ServiceResult } from '../base/BaseService';
import { Prisma, AlertType } from '@prisma/client';
import { NotificationService } from '../shared/NotificationService';

export interface CreateAlertInput {
  userId: string;
  type: AlertType;
  targetId: string;
  targetPrice?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateAlertInput {
  targetPrice?: number;
  active?: boolean;
  metadata?: Record<string, unknown>;
}

export class AlertService extends BaseService {
  private notificationService: NotificationService;

  constructor() {
    super();
    this.notificationService = new NotificationService();
  }

  /**
   * Create price alert
   */
  async create(input: CreateAlertInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'userId',
        'type',
        'targetId',
      ]);

      const alert = await this.prisma.alert.create({
        data: {
          userId: input.userId,
          type: input.type,
          target: input.targetId,
          condition: { targetPrice: input.targetPrice },
          active: true,
        },
      });

      await this.logAudit(input.userId, 'CREATE', 'Alert', alert.id, {
        type: input.type,
        target: input.targetId,
      });

      return alert;
    }, 'create');
  }

  /**
   * Get alert by ID
   */
  async getById(id: string, userId?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const alert = await this.prisma.alert.findUnique({
        where: { id },
      });

      if (!alert) {
        throw {
          name: 'NotFoundError',
          message: 'Alert not found',
        };
      }

      if (userId && alert.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to view this alert',
        };
      }

      return alert;
    }, 'getById');
  }

  /**
   * Get user's alerts
   */
  async getUserAlerts(userId: string, activeOnly = true): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const where: Prisma.AlertWhereInput = {
        userId,
        ...(activeOnly && { active: true }),
      };

      const alerts = await this.prisma.alert.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return alerts;
    }, 'getUserAlerts');
  }

  /**
   * Update alert
   */
  async update(
    id: string,
    input: UpdateAlertInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const existing = await this.prisma.alert.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Alert not found',
        };
      }

      if (existing.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to update this alert',
        };
      }

      const alert = await this.prisma.alert.update({
        where: { id },
        data: {
          condition: input.targetPrice ? { targetPrice: input.targetPrice } : undefined,
          active: input.active,
        },
      });

      await this.logAudit(userId, 'UPDATE', 'Alert', id, {
        changes: input,
      });

      return alert;
    }, 'update');
  }

  /**
   * Delete alert
   */
  async delete(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const existing = await this.prisma.alert.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Alert not found',
        };
      }

      if (existing.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to delete this alert',
        };
      }

      await this.prisma.alert.delete({
        where: { id },
      });

      await this.logAudit(userId, 'DELETE', 'Alert', id);
    }, 'delete');
  }

  /**
   * Trigger alert (called when price condition is met)
   */
  async triggerAlert(alertId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const alert = await this.prisma.alert.findUnique({
        where: { id: alertId },
      });

      if (!alert || !alert.active) {
        return;
      }

      // Send notification
      await this.notificationService.create({
        userId: alert.userId,
        title: 'Price Alert',
        message: this.getAlertMessage(alert.type, (alert.condition as any).targetPrice),
        type: 'PRICE_ALERT',
        actionUrl: this.getAlertActionUrl(alert.type, alert.target),
      });

      // Mark alert as triggered
      await this.prisma.alert.update({
        where: { id: alertId },
        data: {
            active: false, // Deactivate after triggering
        },
      });

      await this.logAudit(undefined, 'TRIGGER', 'Alert', alertId);
    }, 'triggerAlert');
  }

  /**
   * Check and trigger alerts for a target
   */
  async checkAndTriggerAlerts(
    type: AlertType,
    targetId: string,
    currentPrice: number
  ): Promise<ServiceResult<number>> {
    return this.execute(async () => {
      const alerts = await this.prisma.alert.findMany({
        where: {
          type,
          targetId,
          active: true,
        },
      });

      let triggeredCount = 0;

      for (const alert of alerts) {
        // Check if price condition is met
        let shouldTrigger = false;

        if (alert.type === AlertType.PRICE_DROP && (alert.condition as any).targetPrice) {
          shouldTrigger = currentPrice <= (alert.condition as any).targetPrice;
        } else if (alert.type === AlertType.AVAILABILITY) {
          shouldTrigger = true; // Trigger when back in stock
        } else if (alert.type === AlertType.SALE_START) {
          shouldTrigger = true; // Trigger when sale starts
        }

        if (shouldTrigger) {
          await this.triggerAlert(alert.id);
          triggeredCount++;
        }
      }

      return triggeredCount;
    }, 'checkAndTriggerAlerts');
  }

  /**
   * Toggle alert active status
   */
  async toggleActive(id: string, userId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const existing = await this.prisma.alert.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Alert not found',
        };
      }

      if (existing.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to update this alert',
        };
      }

      const alert = await this.prisma.alert.update({
        where: { id },
        data: {
          active: !existing.active,
        },
      });

      await this.logAudit(userId, 'TOGGLE_ACTIVE', 'Alert', id, {
        active: alert.active,
      });

      return alert;
    }, 'toggleActive');
  }

  /**
   * Get alert message based on type
   */
  private getAlertMessage(type: AlertType, targetPrice?: number): string {
    switch (type) {
      case AlertType.PRICE_DROP:
        return `Price dropped to ${targetPrice ? `$${targetPrice}` : 'your target price'}!`;
      case AlertType.AVAILABILITY:
        return 'Item is back in stock!';
      case AlertType.SALE_START:
        return 'Sale has started!';
      default:
        return 'Your alert has been triggered!';
    }
  }

  /**
   * Get action URL based on alert type
   */
  private getAlertActionUrl(type: AlertType, targetId: string): string {
    switch (type) {
      case AlertType.PRICE_DROP:
      case AlertType.AVAILABILITY:
        return `/events/${targetId}`;
      case AlertType.SALE_START:
        return `/events/${targetId}`;
      default:
        return '/';
    }
  }

  /**
   * Get alert count for user
   */
  async getCount(userId: string, activeOnly = true): Promise<ServiceResult<number>> {
    return this.execute(async () => {
      const count = await this.prisma.alert.count({
        where: {
          userId,
          ...(activeOnly && { active: true }),
        },
      });

      return count;
    }, 'getCount');
  }
}
