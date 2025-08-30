import Razorpay from 'razorpay';
import _config from './_config';

export const razorpay = new Razorpay({
    key_id: _config.razorpayKeyId,
    key_secret: _config.razorpayKeySecret,
});
