import useCart from '@framework/cart/use-cart'
import Image from 'next/image'

export default function UserIcon({isCustomerLoggedIn}: {isCustomerLoggedIn: boolean}) {
  const { data } = useCart()
  return(
    <>
      {isCustomerLoggedIn
        ? <Image src="/user-icon.png" width="28" height="28" alt="login" className="mt-[4.5px]" title="Logout" />
        : <Image src="/login-icon.png" width="24" height="24" alt="login" title="Login"/>}
    </>
  )
}
