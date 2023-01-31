import { NextApiRequest, NextApiResponse } from 'next'
import OrdersRepository from '../../../repositories/orders-reporitory'

const isProduction = process.env.NODE_ENV === 'production'
const DUMMY_IMG = 'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png'

const stripe = require('stripe')('sk_test_51MQY4aK9cXkj282noSPPEmFoIaQG4RCLF9ygKXqB66moQfPEKtSwpifb8Y9s3Vs6r1p63ttrPLQOAMtkZ7Caf53f000yT7aZge')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const authCookie = String(req.headers.cookie)
  const shopApiUrl = String(process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL)
  const ordersRepository = new OrdersRepository(shopApiUrl, authCookie)
  try {
    const { activeOrder: { lines }  } = await ordersRepository.getActiveOrder()

    const line_items = lines.map((line: any) => {
      const {
        unitPriceWithTax,
        productVariant: { name, currencyCode, product },
        quantity
      } = line

      return  {
        price_data: {
          currency: currencyCode,
          unit_amount: unitPriceWithTax,
          product_data: {
            name,
            description: product.description,
            images: [isProduction ? product.featuredAsset.source.replace(/\\/g, '/') : DUMMY_IMG]
          }
        },
        quantity
      }
    })

    const params = {
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {},
      line_items,
      success_url: `${process.env.URL_BASE}/profile`,
      cancel_url: `${process.env.URL_BASE}/`,
    }

    const session = await stripe.checkout.sessions.create(params)
    res.redirect(303, session.url);

  } catch (e) {
    res.status(402).json({error: (e as Record<string, any>).message})

  }
}

