import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { env } from './env';
import { ApiError, ApiResponse } from '@/types/api';
import { toast } from 'sonner';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: env.API_URL,
    timeout: 10000,
    withCredentials: true, // Important: Include cookies in requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add request timestamp for debugging
        if (env.isDev) {
            console.log(
                `🚀 Request: ${config.method?.toUpperCase()} ${config.url} at ${new Date().toISOString()}`,
            );
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    },
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        if (env.isDev) {
            console.log(
                `✅ Response: ${response.status} ${response.config.url} at ${new Date().toISOString()}`,
            );
        }
        return response;
    },
    (error: AxiosError<ApiError>) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        if (env.isDev) {
            console.error('❌ Response Error:', error);

            if (error.request) {
                // The request was made but no response was received
                console.error(
                    'Network error or no response received:',
                    error.request,
                );
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
            }
        }

        // Handle specific error codes
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                
                case 440: {
                    // Session timeout
                    if (window.location.pathname !== '/auth/login') {
                        toast.error(
                            'Session expired. Please log in again. Redirecting in 5 seconds...',
                        );
                        setTimeout(() => {
                            window.location.href = '/auth/login';
                        }, 5000);
                    }
                    break;
                }
            }
        }

        return Promise.reject(error.response?.data || error);
    },
);

// Generic API methods
export const api = {
    // GET request
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.get<ApiResponse<T>>(url, config);
        return response.data.data;
    },

    // POST request
    post: async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const response = await apiClient.post<ApiResponse<T>>(
            url,
            data,
            config,
        );
        return response.data.data;
    },

    // PUT request
    put: async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const response = await apiClient.put<ApiResponse<T>>(url, data, config);
        return response.data.data;
    },

    // PATCH request
    patch: async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<T> => {
        const response = await apiClient.patch<ApiResponse<T>>(
            url,
            data,
            config,
        );
        return response.data.data;
    },

    // DELETE request
    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.delete<ApiResponse<T>>(url, config);
        return response.data.data;
    },

    // Upload file
    upload: async <T>(
        url: string,
        file: File,
        onProgress?: (progress: number) => void,
    ): Promise<T> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<ApiResponse<T>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    onProgress(progress);
                }
            },
        });

        return response.data.data;
    },
};

// Export the axios instance for direct use if needed
export { apiClient };

export default api;
