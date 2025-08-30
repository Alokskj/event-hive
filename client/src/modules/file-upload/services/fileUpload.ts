import api from '@/utils/api';
import { FileUploadResponse } from '../types';

export const uploadFile = async (file: {
  uri: string;
  shouldOptimize?: boolean;
}): Promise<FileUploadResponse> => {
  const formData = new FormData();

  const fileUri = file.uri.replace('file:/data', 'file:///data'); // Ensure correct file URI format
  const filename = file.uri.split('/').pop() || 'upload.jpg';
  const fileTypeMatch = /\.(\w+)$/.exec(filename);
  const mimeType = fileTypeMatch ? `image/${fileTypeMatch[1]}` : 'image/jpeg';

  // RN FormData requires a specific format for file uploads
  formData.append('file', {
    uri: file.uri,
    name: filename,
    type: mimeType,
  } as any); // `as any` required in RN to satisfy FormData

  if (file.shouldOptimize) {
    formData.append('shouldOptimize', 'true');
  }

  const res = await api.post<FileUploadResponse>('/file-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

// Web-compatible file upload for File objects
export const uploadWebFile = async (file: File, shouldOptimize?: boolean): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (shouldOptimize) {
    formData.append('shouldOptimize', 'true');
  }

  const res = await api.post<FileUploadResponse>('/file-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

// Upload multiple files for web
export const uploadMultipleWebFiles = async (
  files: File[], 
  shouldOptimize?: boolean
): Promise<FileUploadResponse[]> => {
  const uploadPromises = files.map(file => uploadWebFile(file, shouldOptimize));
  return Promise.all(uploadPromises);
};
