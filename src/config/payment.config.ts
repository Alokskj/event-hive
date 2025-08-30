import Razorpay from 'razorpay';
import { getEnv } from '../lib/utils/get-env';

export const razorpay = new Razorpay({
    key_id: getEnv('RAZORPAY_KEY_ID'),
    key_secret: getEnv('RAZORPAY_KEY_SECRET'),
});
