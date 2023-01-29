// This is your test secret API key.
const stripe = require("stripe")('sk_test_51MQY4aK9cXkj282noSPPEmFoIaQG4RCLF9ygKXqB66moQfPEKtSwpifb8Y9s3Vs6r1p63ttrPLQOAMtkZ7Caf53f000yT7aZge');

const calculateOrderAmount = (items: any) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

export default async function handler(req: any, res: any) {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
