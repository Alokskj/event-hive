import { useMutation } from '@tanstack/react-query';
import { uploadFile, uploadWebFile, uploadMultipleWebFiles } from '../services/fileUpload';
import { FileUploadOptions, FileUploadResponse } from '../types';
import { ApiError } from '@/types';

export const useFileUpload = (options?: FileUploadOptions) => {
  return useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      console.log('Upload Error', error.message);
      options?.onError?.(error);
    },
  });
};

// Hook for web file uploads
export const useWebFileUpload = (options?: FileUploadOptions) => {
  return useMutation({
    mutationFn: ({ file, shouldOptimize }: { file: File; shouldOptimize?: boolean }) => 
      uploadWebFile(file, shouldOptimize),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      console.log('Upload Error', error.message);
      options?.onError?.(error);
    },
  });
};

// Hook for multiple web file uploads
export const useMultipleWebFileUpload = (options?: {
  onSuccess?: (data: FileUploadResponse[]) => void;
  onError?: (error: ApiError) => void;
}) => {
  return useMutation({
    mutationFn: ({ files, shouldOptimize }: { files: File[]; shouldOptimize?: boolean }) => 
      uploadMultipleWebFiles(files, shouldOptimize),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      console.log('Upload Error', error.message);
      options?.onError?.(error);
    },
  });
};
