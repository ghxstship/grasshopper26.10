/**
 * Queue Service
 * Manages background job processing with Bull/BullMQ
 */

import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

let connection: Redis | null = null;

function getRedisConnection(): Redis {
  if (!connection) {
    connection = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
    });
  }
  return connection;
}

interface JobData {
  type: string;
  payload: Record<string, unknown>;
}

export class QueueService {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();

  /**
   * Create or get a queue
   */
  getQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, { connection: getRedisConnection() });
      this.queues.set(name, queue);
    }
    return this.queues.get(name)!;
  }

  /**
   * Add job to queue
   */
  async addJob(
    queueName: string,
    jobName: string,
    data: Record<string, unknown>,
    options?: {
      delay?: number;
      priority?: number;
      attempts?: number;
      backoff?: number;
    }
  ) {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.add(jobName, data, {
        delay: options?.delay,
        priority: options?.priority,
        attempts: options?.attempts || 3,
        backoff: {
          type: 'exponential',
          delay: options?.backoff || 1000,
        },
      });

      return {
        success: true,
        jobId: job.id,
      };
    } catch (error) {
      console.error('Error adding job to queue:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process jobs in queue
   */
  createWorker(
    queueName: string,
    processor: (job: Job<JobData>) => Promise<void>
  ) {
    if (this.workers.has(queueName)) {
      console.warn(`Worker for queue ${queueName} already exists`);
      return this.workers.get(queueName)!;
    }

    const worker = new Worker(queueName, processor, { connection: getRedisConnection() });

    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed in queue ${queueName}`);
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed in queue ${queueName}:`, err);
    });

    this.workers.set(queueName, worker);
    return worker;
  }

  /**
   * Get job status
   */
  async getJobStatus(queueName: string, jobId: string) {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.getJob(jobId);

      if (!job) {
        return { found: false };
      }

      return {
        found: true,
        id: job.id,
        name: job.name,
        data: job.data,
        progress: job.progress,
        state: await job.getState(),
        returnValue: job.returnvalue,
        failedReason: job.failedReason,
        attemptsMade: job.attemptsMade,
        timestamp: job.timestamp,
      };
    } catch (error) {
      console.error('Error getting job status:', error);
      throw error;
    }
  }

  /**
   * Remove job from queue
   */
  async removeJob(queueName: string, jobId: string) {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.getJob(jobId);

      if (job) {
        await job.remove();
        return { success: true };
      }

      return { success: false, error: 'Job not found' };
    } catch (error) {
      console.error('Error removing job:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get queue metrics
   */
  async getQueueMetrics(queueName: string) {
    try {
      const queue = this.getQueue(queueName);

      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
        queue.getDelayedCount(),
      ]);

      return {
        waiting,
        active,
        completed,
        failed,
        delayed,
        total: waiting + active + completed + failed + delayed,
      };
    } catch (error) {
      console.error('Error getting queue metrics:', error);
      throw error;
    }
  }

  /**
   * Clean completed jobs
   */
  async cleanQueue(queueName: string, grace = 3600000) {
    try {
      const queue = this.getQueue(queueName);
      await queue.clean(grace, 100, 'completed');
      await queue.clean(grace, 100, 'failed');

      return { success: true };
    } catch (error) {
      console.error('Error cleaning queue:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Pause queue
   */
  async pauseQueue(queueName: string) {
    try {
      const queue = this.getQueue(queueName);
      await queue.pause();
      return { success: true };
    } catch (error) {
      console.error('Error pausing queue:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Resume queue
   */
  async resumeQueue(queueName: string) {
    try {
      const queue = this.getQueue(queueName);
      await queue.resume();
      return { success: true };
    } catch (error) {
      console.error('Error resuming queue:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Close all queues and workers
   */
  async closeAll() {
    try {
      await Promise.all([
        ...Array.from(this.queues.values()).map((q) => q.close()),
        ...Array.from(this.workers.values()).map((w) => w.close()),
      ]);

      this.queues.clear();
      this.workers.clear();

      return { success: true };
    } catch (error) {
      console.error('Error closing queues:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const queueService = new QueueService();

// Common queue names
export const QUEUE_NAMES = {
  EMAIL: 'email',
  SMS: 'sms',
  NOTIFICATIONS: 'notifications',
  TICKETS: 'tickets',
  ORDERS: 'orders',
  ANALYTICS: 'analytics',
  EXPORTS: 'exports',
} as const;
