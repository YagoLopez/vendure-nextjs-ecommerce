import { NextApiRequest, NextApiResponse } from 'next'
import OrdersRepository from '@lib/repositories/orders-repository'

const isProduction = process.env.NODE_ENV === 'production'
const DUMMY_IMG = 'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png'
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

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
        productVariant: { name, currencyCode, product: { description} },
        quantity,
        featuredAsset,
      } = line
      return  {
        price_data: {
          currency: currencyCode,
          unit_amount: unitPriceWithTax,
          product_data: {
            name,
            description,
            images: [isProduction ? featuredAsset.preview.replace(/\\/g, '/') : DUMMY_IMG]
          }
        },
        quantity
      }
    })

    const url_schema = process.env.NODE_ENV === "development" ? "http" : "https"
    const hostname = req.headers.host
    const success_url = `${url_schema}://${hostname}/success?code=${code}`
    const cancel_url = `${url_schema}://${hostname}/cart`

    const stripeCheckoutSessionParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {},
      line_items,
      success_url,
      cancel_url,
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

    // (5) Create Stripe Payment Session
    const session = await stripe.checkout.sessions.create(stripeCheckoutSessionParams)
    console.log('url_schema', url_schema)
    console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    console.log('session.success_url', session.success_url)
    console.log('session.cancel_url', session.cancel_url)
    res.redirect(303, session.url);

  } catch (e) {
    res.status(402).json(e)

  }
}

