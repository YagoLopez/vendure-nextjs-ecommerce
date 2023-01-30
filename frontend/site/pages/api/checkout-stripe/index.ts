import { NextApiRequest, NextApiResponse } from 'next'
import OrdersRepository from '../../../repositories/orders-reporitory'
import { getCookies } from 'cookies-next';

const stripe = require('stripe')('sk_test_51MQY4aK9cXkj282noSPPEmFoIaQG4RCLF9ygKXqB66moQfPEKtSwpifb8Y9s3Vs6r1p63ttrPLQOAMtkZ7Caf53f000yT7aZge');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const cookies = getCookies({req, res});
  const shopApiUrl = String(process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL)
  const ordersRepository = new OrdersRepository(shopApiUrl, cookies)
  const activeOrder = await ordersRepository.getActiveOrder()

  console.log('activeOrder', activeOrder)
  console.log('cookies', cookies)

  const params = {
    payment_method_types: ['card'],
    mode: 'payment',
    metadata: {},
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: 2000,
        product_data: {
          name: 'Nike Air Force 1',
          description: 'This is the product description',
          images: [
            'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bmlrZSUyMHNob2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
          ]
        },
      },
      quantity: 1,
    }],
    // success_url: `${req.headers.origin}?status=success&session_id={CHECKOUT_SESSION_ID}`,
    // cancel_url: `${req.headers.origin}?status=cancelled`,
    success_url: 'http://localhost:8000/profile',
    cancel_url: 'http://localhost:8000/cart',

  }

  // const session = await stripe.checkout.sessions.create(params)
  // console.log('session.url', session.url)
  // res.redirect(303, session.url);
  res.status(200).json({cookies, activeOrder})
}

