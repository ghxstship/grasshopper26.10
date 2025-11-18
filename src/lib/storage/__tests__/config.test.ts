/**
 * Storage configuration tests
 */

import { STORAGE_BUCKETS, getBucketConfig, validateFileForBucket, formatBytes, generateStoragePath, getFileExtension, isImageFile, isDocumentFile,  } from '../config';

describe('Storage Configuration', () => {
  describe('STORAGE_BUCKETS', () => {
    it('should have all required buckets', () => {
      expect(STORAGE_BUCKETS.GVTEWAY_AVATARS).toBe('gvteway-avatars');
      expect(STORAGE_BUCKETS.GVTEWAY_DOCUMENTS).toBe('gvteway-documents');
      expect(STORAGE_BUCKETS.COMPVSS_ADVANCING).toBe('compvss-advancing');
      expect(STORAGE_BUCKETS.ATLVS_ASSETS).toBe('atlvs-assets');
    });
  });

  describe('getBucketConfig', () => {
    it('should return correct config for bucket', () => {
      const config = getBucketConfig(STORAGE_BUCKETS.GVTEWAY_AVATARS);
      expect(config.name).toBe('GVTEWAY Avatars');
      expect(config.maxSize).toBe(5 * 1024 * 1024);
      expect(config.public).toBe(true);
    });
  });

  describe('validateFileForBucket', () => {
    it('should validate file size', () => {
      const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });

      const result = validateFileForBucket(largeFile, STORAGE_BUCKETS.GVTEWAY_AVATARS);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should validate file type', () => {
      const invalidFile = new File(['test'], 'test.exe', {
        type: 'application/x-msdownload',
      });

      const result = validateFileForBucket(invalidFile, STORAGE_BUCKETS.GVTEWAY_AVATARS);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should accept valid files', () => {
      const validFile = new File(['test'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const result = validateFileForBucket(validFile, STORAGE_BUCKETS.GVTEWAY_AVATARS);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('generateStoragePath', () => {
    it('should generate path with userId and filename', () => {
      const path = generateStoragePath('user123', 'test.jpg');
      expect(path).toMatch(/^user123\/\d+-test\.jpg$/);
    });

    it('should generate path with folder', () => {
      const path = generateStoragePath('user123', 'test.jpg', 'avatars');
      expect(path).toMatch(/^user123\/avatars\/\d+-test\.jpg$/);
    });

    it('should sanitize filename', () => {
      const path = generateStoragePath('user123', 'test file (1).jpg');
      expect(path).toMatch(/^user123\/\d+-test_file__1_\.jpg$/);
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('test.jpg')).toBe('jpg');
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('archive.tar.gz')).toBe('gz');
    });

    it('should return empty string for no extension', () => {
      expect(getFileExtension('noextension')).toBe('');
    });
  });

  describe('isImageFile', () => {
    it('should identify image files', () => {
      expect(isImageFile('image/jpeg')).toBe(true);
      expect(isImageFile('image/png')).toBe(true);
      expect(isImageFile('application/pdf')).toBe(false);
    });
  });

  describe('isDocumentFile', () => {
    it('should identify document files', () => {
      expect(isDocumentFile('application/pdf')).toBe(true);
      expect(isDocumentFile('application/msword')).toBe(true);
      expect(isDocumentFile('image/jpeg')).toBe(false);
    });
  });
});
