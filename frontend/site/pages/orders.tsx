import { Bag } from '@components/icons'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import OrdersRepository from '../repositories/orders-reporitory'

export const getServerSideProps: GetServerSideProps<{customerOrders: Record<string, unknown> | null}> =
  async ({ req, res, query }) => {

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    )

    let result
    try {
      const authCookie = String(req.headers.cookie)
      const ordersRepository = new OrdersRepository(authCookie)
      const { activeCustomer: { orders: { items } }} = await ordersRepository.getCustomerOrders()
      result = { customerOrders: items }
    } catch (e) {
      result = { customerOrders: null, error: JSON.stringify(e) }
    }
    return {
      props: result
    }
  }

export default function CustomerOrdersPage({customerOrders}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('customer orders', customerOrders)
  return (
    <>
      <Container className="pt-4">
        <Text variant="pageHeading">My Orders</Text>
        {customerOrders
          ?
            (<pre>{JSON.stringify(customerOrders, null, 2)}</pre>)
          : (
            <div className="flex-1 p-24 flex flex-col justify-center items-center ">
              <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
                <Bag className="absolute" />
              </span>
              <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
                No orders found
              </h2>
              <p className="text-accent-6 px-10 text-center pt-2">
                Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
              </p>
            </div>
            )
        }
      </Container>
    </>
  )
}

CustomerOrdersPage.Layout = Layout
