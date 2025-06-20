import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface UploadProgressCallback {
  (progress: number): void;
}

interface UploadOptions {
  folder?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  onProgress?: UploadProgressCallback;
}

const defaultOptions: UploadOptions = {
  folder: 'uploads',
  maxSizeMB: 100, // 100MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
  onProgress: () => {},
};

export const uploadFile = async (
  file: File,
  options: UploadOptions = {}
): Promise<string> => {
  const { folder, maxSizeMB, allowedTypes, onProgress } = {
    ...defaultOptions,
    ...options,
  };

  // Validate file type
  if (!allowedTypes?.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes?.join(', ')}`
    );
  }

  // Validate file size
  const maxSizeBytes = maxSizeMB! * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(
      `File size exceeds ${maxSizeMB}MB limit. Current size: ${(
        file.size /
        (1024 * 1024)
      ).toFixed(2)}MB`
    );
  }

  // Generate unique file name
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${folder}/${fileName}`;

  // Create storage reference
  const storageRef = ref(storage, filePath);

  // Upload file with progress monitoring
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

export const getFileURL = async (filePath: string): Promise<string> => {
  const fileRef = ref(storage, filePath);
  return getDownloadURL(fileRef);
};

export const validateFile = (
  file: File,
  options: UploadOptions = defaultOptions
): boolean => {
  const { maxSizeMB, allowedTypes } = { ...defaultOptions, ...options };

  if (!allowedTypes?.includes(file.type)) {
    return false;
  }

  const maxSizeBytes = maxSizeMB! * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return false;
  }

  return true;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}; 