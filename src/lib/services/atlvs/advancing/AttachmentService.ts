import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { HistoryService } from './HistoryService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = 'atlvs-advancing';

export interface UploadAttachmentInput {
  requestId: string;
  userId: string;
  file: File;
}

export interface CreateAttachmentInput {
  requestId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  metadata?: Record<string, unknown>;
}

/**
 * Service for managing file attachments on advancing requests
 */
export class AttachmentService {
  private historyService: HistoryService;

  constructor() {
    this.historyService = new HistoryService();
  }

  /**
   * Upload file to Supabase Storage and create attachment record
   */
  async upload(input: UploadAttachmentInput) {
    const { requestId, userId, file } = input;

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${requestId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    // Create attachment record
    const attachment = await this.create({
      requestId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: urlData.publicUrl,
      uploadedBy: userId,
      metadata: {
        originalName: file.name,
        storagePath: fileName,
      },
    });

    // Create history entry
    await this.historyService.create({
      requestId,
      userId,
      action: 'attachment_added',
      metadata: {
        attachmentId: attachment.id,
        fileName: file.name,
      },
    });

    return attachment;
  }

  /**
   * Create attachment record
   */
  async create(input: CreateAttachmentInput) {
    return prisma.advancingAttachment.create({
      data: {
        requestId: input.requestId,
        fileName: input.fileName,
        fileSize: input.fileSize,
        fileType: input.fileType,
        fileUrl: input.fileUrl,
        uploadedBy: input.uploadedBy,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
      },
    });
  }

  /**
   * Get attachment by ID
   */
  async getById(id: string) {
    const attachment = await prisma.advancingAttachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    return attachment;
  }

  /**
   * List attachments for a request
   */
  async listByRequest(requestId: string) {
    return prisma.advancingAttachment.findMany({
      where: { requestId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete attachment
   */
  async delete(id: string, userId: string) {
    const attachment = await this.getById(id);

    // Only allow deletion by uploader or admin
    if (attachment.uploadedBy !== userId) {
      throw new Error('Unauthorized to delete this attachment');
    }

    // Delete from Supabase Storage
    const storagePath = (attachment.metadata as Record<string, unknown>)?.storagePath as string;
    if (storagePath) {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath]);

      if (deleteError) {
        console.error('Failed to delete file from storage:', deleteError);
      }
    }

    // Delete database record
    await prisma.advancingAttachment.delete({
      where: { id },
    });

    // Create history entry
    await this.historyService.create({
      requestId: attachment.requestId,
      userId,
      action: 'attachment_deleted',
      metadata: {
        attachmentId: id,
        fileName: attachment.fileName,
      },
    });

    return { success: true };
  }

  /**
   * Get total size of attachments for a request
   */
  async getTotalSize(requestId: string): Promise<number> {
    const attachments = await this.listByRequest(requestId);
    return attachments.reduce((total, att) => total + att.fileSize, 0);
  }

  /**
   * Check if storage bucket exists, create if not
   */
  async ensureBucket() {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
      const _uploadData = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });

      if (_uploadData.error) {
        throw new Error(`Failed to create bucket: ${_uploadData.error.message}`);
      }
    }
  }
}
