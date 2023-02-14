import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import usePrice from '@framework/product/use-price'
import { Layout } from '@components/common'
import { Button, Container } from '@components/ui'
import { Check } from '@components/icons'
import React from 'react'
import OrdersRepository from '../repositories/orders-reporitory'
import setCacheHeaders from '@lib/setCacheHeaders'

// todo: avoid "any" type
export const getServerSideProps: GetServerSideProps<{ paymentMethod: any , orderByCode: any}> =
  async ({ req, res, query }) => {

    if(!query.code || query.code === 'undefined') return {
      props: { paymentMethod: null, orderByCode: null }
    }

    setCacheHeaders(res)

    let response
    try {
      const authCookie = String(req.headers.cookie)
      const ordersRepository = new OrdersRepository(authCookie)
      const paymentMethod = await ordersRepository.createPayment()

      if(paymentMethod.method) {
        await ordersRepository.addPayment(paymentMethod)
      }

      const { orderByCode } = await ordersRepository.getOrderByCode(String(query.code))
      response = {props: { paymentMethod, orderByCode, error: null}}

    } catch (e) {
      response = {props: { paymentMethod: null, orderByCode: null, error: null}}

    }
    return response
}

export default function Cart({ paymentMethod, orderByCode }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const {
    currencyCode,
    subTotal,
    subTotalWithTax,
    totalWithTax,
    shippingWithTax,
    taxSummary: [ taxSummary ],
  } = orderByCode
  const { taxRate, description: taxDescription } = taxSummary

  const { price: subTotalCurrency } = usePrice({ amount: subTotal, currencyCode })
  const { price: subTotalCurrencyWithTax } = usePrice({ amount: subTotalWithTax, currencyCode })
  const { price: totalCurrencyWithTax } = usePrice({ amount: totalWithTax, currencyCode })
  const { price: shippingCurrencyWithTax } = usePrice({ amount: shippingWithTax, currencyCode })


  return (
    <Container className="grid lg:grid-cols-12 pt-4 gap-20">
      <div className="lg:col-span-7">
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
            <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
              <Check />
            </span>
          <h2 className="pt-6 text-xl font-light text-center">
            Thank you for your order.
          </h2>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="flex-shrink-0 px-4 py-24 sm:px-6">
          <div className="border-t border-accent-2">
            <ul className="py-3">
              <li className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{subTotalCurrency}</span>
              </li>
              <li className="flex justify-between py-1">
                <span>{taxDescription}</span>
                <span>{taxRate} %</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Subtotal With Tax</span>
                <span>{subTotalCurrencyWithTax}</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Estimated Shipping</span>
                <span className="font-bold tracking-wide">{shippingCurrencyWithTax}</span>
              </li>
            </ul>
            <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-10">
              <span>Total</span>
              <span>{totalCurrencyWithTax}</span>
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <div className="w-full lg:w-72">
              <Button href="/" Component="a" width="100%">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

Cart.Layout = Layout
