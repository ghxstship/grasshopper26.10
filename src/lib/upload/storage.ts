export interface UploadConfig {
  maxSize: number;
  allowedTypes: string[];
}

export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ],
};

export function validateFile(file: File, config: UploadConfig = DEFAULT_UPLOAD_CONFIG): void {
  if (file.size > config.maxSize) {
    throw new Error(`File size exceeds ${config.maxSize / 1024 / 1024}MB limit`);
  }

  if (!config.allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }
}

export async function uploadToStorage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.url;
}
