import { ApiError } from "@/types";

export interface FileUploadResponse {
  success: boolean;
  fileKey: string;
  fileUrl: string;
  message: string;
}

export interface FileUploadOptions {
  onSuccess?: (data: FileUploadResponse) => void;
  onError?: (error: ApiError) => void;
}
