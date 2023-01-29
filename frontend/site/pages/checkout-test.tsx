import useCart from '@framework/cart/use-cart'
import { FeatureBar, Footer, Layout, Navbar } from '@components/common'
import { CommerceProvider } from '@framework'
import cn from 'clsx'
import s from '@components/common/Layout/Layout.module.css'
import { CheckoutProvider } from '@components/checkout/context'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { useRouter } from 'next/router'




export default function CheckoutTest() {

  const { data, isLoading, isEmpty } = useCart()
  console.log(data)

  return (
    <>
      <pre style={{fontSize: 12}}>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

CheckoutTest.Layout = Layout
