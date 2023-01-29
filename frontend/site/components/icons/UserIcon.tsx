import useCart from '@framework/cart/use-cart'

export default function UserIcon({isCustomerLoggedIn}: {isCustomerLoggedIn: boolean}) {
  const { data } = useCart()
  return(
    <>
      {isCustomerLoggedIn
        ? <img src="/user-icon.png" alt="login" className="h-7 w-7 mt-[4.5px]" title="Logout" />
        : <img src="/login-icon.png" alt="login" className="h-6 w-6" title="Login"/>}
    </>
  )
}
