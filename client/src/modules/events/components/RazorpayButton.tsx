import { useState } from 'react';
import { PaymentService } from '../services/payment.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { env } from '@/utils/env';

interface Props {
  bookingId: string;
  amount: number; // in smallest currency unit *100 already? We'll re-fetch initiate anyway
  onSuccess: (paymentId: string) => void;
  disabled?: boolean;
}

// Dynamically load script
function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve(true);
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const RazorpayButton = ({ bookingId, onSuccess, disabled }: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!ok) { toast.error('Failed to load payment gateway'); setLoading(false); return; }
    try {
      const init = await PaymentService.initiate(bookingId, 'RAZORPAY');
      const options: any = {
        key: env.razorpayKeyId,
        amount: init.amount, // in paise
        currency: init.currency,
        name: 'EventHive',
        description: 'Event Booking',
        order_id: init.orderId,
        handler: async (response: any) => {
          try { await PaymentService.verify(response); toast.success('Payment successful'); onSuccess(response.razorpay_payment_id); }
          catch(e:any){ toast.error(e.message || 'Verification failed'); }
        },
        prefill: {},
        theme: { color: '#4f46e5' },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e:any) {
      toast.error(e.message || 'Payment init failed');
    } finally { setLoading(false); }
  };

  return <Button onClick={handlePay} disabled={disabled || loading}>{loading ? 'Processing...' : 'Pay & Confirm'}</Button>;
};

export default RazorpayButton;
