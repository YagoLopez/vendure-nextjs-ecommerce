import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import { Bag, Cross, MapPin, CreditCard } from '@components/icons'
import { CartItem } from '@components/cart'
import { useUI } from '@components/ui/context'
import React, { FC } from 'react'
import { useRouter } from 'next/router'
import CCTestData from '@components/ui/CCTestData'
import setCacheHeaders  from '@lib/misc'
import OrdersRepository from '../repositories/orders-repository'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps<{taxData: Record<string, string | number> | null, shipping: number, error: string | null}> =
  async ({ req, res, query }) => {

    setCacheHeaders(res)

    let props

    try {
      const authCookie = String(req.headers.cookie)
      const ordersRepository = new OrdersRepository(authCookie)
      const { activeOrder: { taxSummary: [taxData], shipping }  } = await ordersRepository.getActiveOrder()
      props = { taxData: taxData, shipping, error: null }
    } catch (e) {
      props = { taxData: null, shipping: 0, error: (e as any).response?.errors[0].message ?? (e as any).message }
    }
    return {
      props
    }
  }

export default function Cart({taxData, shipping, error}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { query } = useRouter()
  const success = query.success === 'true'
  const { data, isLoading, isEmpty } = useCart()
  const { openSidebar, setSidebarView } = useUI()

  const { price: total } = usePrice(
    data && {
      amount: Number(data.totalPrice),
      currencyCode: data.currency.code,
    }
  )
  const { price: shippingPrice } = usePrice(
    data && {
      amount: Number(shipping/100),
      currencyCode: data.currency.code,
    }
  )

  const goToCheckout = () => {
    openSidebar()
    setSidebarView('CHECKOUT_VIEW')
  }

  const ProceedToCheckoutButton:
    FC<{isCustomCheckout: boolean, checkoutSuccess: boolean, goToCheckout: () => void, total: string}>
      = ({isCustomCheckout, checkoutSuccess, goToCheckout, total}) => {

        if(checkoutSuccess) {
          return null
        } else {
          if(isCustomCheckout){
            return (
              <Button Component="a" width="100%" onClick={goToCheckout}>
                Proceed to Checkout ({total})
              </Button>
            )
          } else {
            return (
              <Button href="/api/checkout-stripe" Component="a" width="100%">
                Proceed to Checkout
              </Button>
            )
          }
        }
  }

  return (
    <Container className="grid lg:grid-cols-12 pt-4 gap-20">
      <div className="lg:col-span-7">
        {isLoading || isEmpty ? (
          <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center ">
            <span className="border border-dashed border-secondary flex items-center justify-center w-16 h-16 bg-primary p-12 rounded-lg text-primary">
              <Bag className="absolute" />
            </span>
            <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
              Your cart is empty
            </h2>
            <p className="text-accent-6 px-10 text-center pt-2">
              Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
            </p>
          </div>
        ) : error ? (
          <div className="flex-1 px-4 flex flex-col justify-center items-center">
            <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
              <Cross width={24} height={24} />
            </span>
            <h2 className="pt-6 text-xl font-light text-center">
              We couldn’t process the purchase. Please check your card
              information and try again.
            </h2>
          </div>
        ) : (
          <div className="lg:px-0 sm:px-6 flex-1">
            <Text variant="pageHeading">My Cart</Text>
            <Text variant="sectionHeading">Review your Order</Text>
            <ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accent-2 border-b border-accent-2">
              {data!.lineItems.map((item: any) => (
                <CartItem
                  key={item.id}
                  item={item}
                  currencyCode={data?.currency.code!}
                />
              ))}
            </ul>
            <div className="my-6">
              <Text>
                Before you leave, take a look at these items. We picked them
                just for you
              </Text>
              <div className="flex py-6 space-x-6">
                {[1, 2, 3, 4, 5, 6].map((x) => (
                  <div
                    key={x}
                    className="border border-accent-3 w-full h-24 bg-accent-2 bg-opacity-50 transform cursor-pointer hover:scale-110 duration-75"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="lg:col-span-5">
        <div className="flex-shrink-0 px-4 py-24 sm:px-6">
          {process.env.COMMERCE_CUSTOMCHECKOUT_ENABLED && (
            <>
              {/* Shipping Address */}
              {/* Only available with customCheckout set to true - Meaning that the provider does offer checkout functionality. */}
              <div className="rounded-md border border-accent-2 px-6 py-6 mb-4 text-center flex items-center justify-center cursor-pointer hover:border-accent-4">
                <div className="mr-5">
                  <MapPin />
                </div>
                <div className="text-sm text-center font-medium">
                  <span className="uppercase">+ Add Shipping Address</span>
                  {/* <span>
                    1046 Kearny Street.<br/>
                    San Franssisco, California
                  </span> */}
                </div>
              </div>
              {/* Payment Method */}
              {/* Only available with customCheckout set to true - Meaning that the provider does offer checkout functionality. */}
              <div className="rounded-md border border-accent-2 px-6 py-6 mb-4 text-center flex items-center justify-center cursor-pointer hover:border-accent-4">
                <div className="mr-5">
                  <CreditCard />
                </div>
                <div className="text-sm text-center font-medium">
                  <span className="uppercase">+ Add Payment Method</span>
                  {/* <span>VISA #### #### #### 2345</span> */}
                </div>
              </div>
            </>
          )}
          <div className="border-t border-accent-2">
            <ul className="py-3">
              <li className="flex justify-between py-1">
                {taxData && (
                  <>
                    <span>{taxData?.description}</span>
                    <span>{taxData?.taxRate} %</span>
                  </>
                )}
              </li>
              <li className="flex justify-between py-1">
                {shipping ? (
                  <>
                    <span>Shipping Price</span>
                    <span>{shippingPrice}</span>
                  </>
                  ) : <span>Shipping Price will be calculated at checkout</span>
                }
              </li>
            </ul>
            <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-10">
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <div className="w-full lg:w-72">
              {isEmpty ? (
                <Button href="/" Component="a" width="100%">
                  Continue Shopping
                </Button>
              ) : (
                <div>
                  <ProceedToCheckoutButton
                    isCustomCheckout={Boolean(process.env.COMMERCE_CUSTOMCHECKOUT_ENABLED)}
                    checkoutSuccess={success}
                    goToCheckout={goToCheckout}
                    total={total}
                  />
                  <CCTestData/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

Cart.Layout = Layout
