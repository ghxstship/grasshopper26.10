import { AdvancingStatus } from '@prisma/client';

/**
 * Service for managing advancing request status transitions
 * Implements business logic for valid status changes
 */
export class StatusService {
  // Define valid status transitions
  private readonly validTransitions: Record<AdvancingStatus, AdvancingStatus[]> = {
    [AdvancingStatus.PENDING]: [
      AdvancingStatus.UNDER_REVIEW,
      AdvancingStatus.REJECTED,
    ],
    [AdvancingStatus.UNDER_REVIEW]: [
      AdvancingStatus.APPROVED,
      AdvancingStatus.REJECTED,
      AdvancingStatus.CHANGES_REQUESTED,
    ],
    [AdvancingStatus.CHANGES_REQUESTED]: [
      AdvancingStatus.UNDER_REVIEW,
      AdvancingStatus.REJECTED,
    ],
    [AdvancingStatus.APPROVED]: [
      AdvancingStatus.COMPLETED,
    ],
    [AdvancingStatus.REJECTED]: [],
    [AdvancingStatus.COMPLETED]: [],
  };

  /**
   * Validate if a status transition is allowed
   */
  async validateTransition(
    currentStatus: AdvancingStatus,
    newStatus: AdvancingStatus
  ): Promise<boolean> {
    const allowedTransitions = this.validTransitions[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get all valid next statuses for a given current status
   */
  getValidNextStatuses(currentStatus: AdvancingStatus): AdvancingStatus[] {
    return this.validTransitions[currentStatus] || [];
  }

  /**
   * Get status color for UI display
   */
  getStatusColor(status: AdvancingStatus): string {
    const colors: Record<AdvancingStatus, string> = {
      [AdvancingStatus.PENDING]: 'bg-warning-light text-warning border-warning-border',
      [AdvancingStatus.UNDER_REVIEW]: 'bg-info-light text-info border-info-border',
      [AdvancingStatus.APPROVED]: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50',
      [AdvancingStatus.REJECTED]: 'bg-error-light text-error border-error-border',
      [AdvancingStatus.CHANGES_REQUESTED]: 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50',
      [AdvancingStatus.COMPLETED]: 'bg-success-light text-success border-success-border',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-500 border-gray-500/50';
  }

  /**
   * Get status label for display
   */
  getStatusLabel(status: AdvancingStatus): string {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Check if status is terminal (no further transitions possible)
   */
  isTerminalStatus(status: AdvancingStatus): boolean {
    return this.validTransitions[status].length === 0;
  }

  /**
   * Check if status requires approval
   */
  requiresApproval(status: AdvancingStatus): boolean {
    return ([
      AdvancingStatus.APPROVED,
      AdvancingStatus.REJECTED,
    ] as AdvancingStatus[]).includes(status);
  }
}
