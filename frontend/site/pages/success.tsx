import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import { Layout } from '@components/common'
import { Button, Container } from '@components/ui'
import { Check } from '@components/icons'
import { useUI } from '@components/ui/context'
import React from 'react'
import { useRouter } from 'next/router'
import OrdersRepository from '../repositories/orders-reporitory'

// todo: avoid "any" type
export const getServerSideProps: GetServerSideProps<{ paymentMethod: any , orderByCode: any}> =
  async ({ req, query }) => {

    if(!query.code || query.code === 'undefined') return {
      props: { paymentMethod: null, orderByCode: null }
    }

    const authCookie = String(req.headers.cookie)
    const ordersRepository = new OrdersRepository(authCookie)
    const paymentMethod = await ordersRepository.createPayment()

    if(paymentMethod.method) {
      await ordersRepository.addPayment(paymentMethod)
    }

    const { orderByCode } = await ordersRepository.getOrderByCode(String(query.code))
    return {
      props: { paymentMethod, orderByCode },
    }
}

export default function Cart({ paymentMethod, orderByCode }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const { query } = useRouter()
  const error = null
  const success = query.success === 'true'
  const { data, isLoading, isEmpty } = useCart()
  const { openSidebar, setSidebarView } = useUI()

  const { price: subTotal } = usePrice(
    data && {
      amount: Number(data.subtotalPrice),
      currencyCode: data.currency.code,
    }
  )
  const { price: total } = usePrice(
    data && {
      amount: Number(data.totalPrice),
      currencyCode: data.currency.code,
    }
  )

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
          <div>
            PAYMENT METHOD<br/>
            <pre>{JSON.stringify(paymentMethod, null, 2)}</pre>
            <hr/>
            <pre>{JSON.stringify(orderByCode, null, 2)}</pre>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="flex-shrink-0 px-4 py-24 sm:px-6">
          <div className="border-t border-accent-2">
            <ul className="py-3">
              <li className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{subTotal}</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Estimated Shipping</span>
                <span className="font-bold tracking-wide">FREE</span>
              </li>
            </ul>
            <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-10">
              <span>Total</span>
              <span>{total}</span>
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
