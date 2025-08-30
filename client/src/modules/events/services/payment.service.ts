import { api } from '@/utils/api';
import { InitiatePaymentResponse } from '../types';

export class PaymentService {
  static async initiate(bookingId: string, method: 'RAZORPAY') {
    return api.post<InitiatePaymentResponse>('/payments/initiate', { bookingId, method });
  }
  static async verify(data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) {
    return api.post<{ status: string }>('/payments/verify', data);
  }
}
