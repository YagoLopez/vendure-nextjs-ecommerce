import { NextApiRequest, NextApiResponse } from 'next'
import OrdersRepository from '../../../repositories/orders-repository'

const isProduction = process.env.NODE_ENV === 'production'
const DUMMY_IMG = 'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png'

const stripe = require('stripe')('sk_test_51MQY4aK9cXkj282noSPPEmFoIaQG4RCLF9ygKXqB66moQfPEKtSwpifb8Y9s3Vs6r1p63ttrPLQOAMtkZ7Caf53f000yT7aZge')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const authCookie = String(req.headers.cookie)
  const ordersRepository = new OrdersRepository(authCookie)

  try {
    const { activeOrder: { code, lines, customer, currencyCode } } = await ordersRepository.getActiveOrder()

    // (1) Set shipping address
    const shippingAddress = ordersRepository.getShippingAddressCustomer(customer)
    await ordersRepository.setShippingAddress(shippingAddress)

    // (2) Set shipping methods
    const {eligibleShippingMethods: shippingMethods} = await ordersRepository.getShippingMethods()
    await ordersRepository.setShippingMethod(shippingMethods[0].id)

    // (3) Transition order to "ArrangingPayment" state
    await ordersRepository.transitionOrderToState("ArrangingPayment")

    // (4) Transform line items
    const line_items = lines.map((line: Record<string, any>) => {
      const {
        unitPriceWithTax,
        productVariant: { name, currencyCode, product: { description, featuredAsset} },
        quantity
      } = line
      return  {
        price_data: {
          currency: currencyCode,
          unit_amount: unitPriceWithTax,
          product_data: {
            name,
            description: description,
            images: [isProduction ? featuredAsset.source.replace(/\\/g, '/') : DUMMY_IMG]
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
      success_url: `${process.env.URL_BASE}/success?code=${code}`,
      cancel_url: `${process.env.URL_BASE}/cart`,
      shipping_options: [{
        shipping_rate_data: {
          display_name: 'Standard',
          type: 'fixed_amount',
          fixed_amount: {
            amount: shippingMethods[0].price,
            currency: currencyCode,
          }
        }
      }]
    }

    const session = await stripe.checkout.sessions.create(params)
    res.redirect(303, session.url);

    // todo: this is for development. remove it
    // res.redirect(303, `/success?code=${code}`)
  } catch (e) {
    res.status(402).json(e)

  }
}

