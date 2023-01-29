import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CheckoutForm } from '@components/checkout/stripe/CheckoutForm'

let _stripe: Promise<Stripe | null>;
function getStripe(publishableKey: string) {
  if (!_stripe) {
    _stripe = loadStripe(publishableKey);
  }
  return _stripe;
}

export default function CheckoutStripe({
                                 clientSecret,
                                 publishableKey,
                                 orderCode,
                               }: {
  clientSecret: string;
  publishableKey: string;
  orderCode: string;
}) {
  debugger
  const options = {
    // passing the client secret obtained from the server
    // clientSecret,
    clientSecret: 'sk_test_51MQY4aK9cXkj282noSPPEmFoIaQG4RCLF9ygKXqB66moQfPEKtSwpifb8Y9s3Vs6r1p63ttrPLQOAMtkZ7Caf53f000yT7aZge'
  };

  // const stripePromise = getStripe(publishableKey);
  const stripePromise = getStripe('pk_test_51MQY4aK9cXkj282nKAPjfQ0A0apcO6yK2UEmn98z4sRwlyocwuBeEAhZwrb2AY4MXJNmYFIrct7o3IJj53K8EnXr00pzgyyOjS');

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm orderCode={orderCode} />
    </Elements>
  );
}
