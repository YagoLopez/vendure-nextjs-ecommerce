import React, { useEffect, useState } from 'react'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm2 from '@components/checkout/stripe/CheckoutForm2'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe('pk_test_51MQY4aK9cXkj282nKAPjfQ0A0apcO6yK2UEmn98z4sRwlyocwuBeEAhZwrb2AY4MXJNmYFIrct7o3IJj53K8EnXr00pzgyyOjS');

export default function CheckoutStripe2() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }), // enviar en el body del POST el carrito
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options as StripeElementsOptions} stripe={stripePromise}>
          <CheckoutForm2 />
        </Elements>
      )}
    </div>
  );
}
