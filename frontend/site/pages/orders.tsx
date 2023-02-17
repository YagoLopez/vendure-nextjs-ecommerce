import { Bag } from '@components/icons'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import OrdersRepository from '../repositories/orders-repository'
import { useRouter } from 'next/router'
import setCacheHeaders, { getFormattedPrice } from '@lib/setCacheHeaders'

export const getServerSideProps: GetServerSideProps<{customerOrders: Record<string, any> | null, error: unknown}> =
  async ({ req, res }) => {

    setCacheHeaders(res)
    let result

    try {
      const authCookie = String(req.headers.cookie)
      const ordersRepository = new OrdersRepository(authCookie)
      const { activeCustomer: { orders: { items } } } = await ordersRepository.getCustomerOrders()
      result = { customerOrders: items, error: null }
    } catch (e) {
      result = { customerOrders: null, error: (e as Error).message }
    }
    return {
      props: result
    }
  }

export default function CustomerOrdersPage({customerOrders, error}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const router = useRouter()
  const onClickOrder = (e: any, code: string) => router.push(`order/${code}`)

  return (
    <Container className="pt-4">
      <Text variant="pageHeading">My Orders</Text>

      {error && <div>{String(error)}</div>}

      {customerOrders && (
        <div className="container p-2 mx-auto sm:p-4 text-gray-800">
          <div className="lg:flex justify-center overflow-x-auto">
            <table className="text-xs sm:text-lg">
              <thead className="bg-secondary text-white">
              <tr className="text-left">
                <th className="p-3 font-medium text-center">Created</th>
                <th className="p-3 font-medium text-center">Code</th>
                <th className="p-3 font-medium text-center">State</th>
                <th className="p-3 font-medium text-center">Total</th>
                <th className="p-3 font-medium">Items</th>
              </tr>
              </thead>
              <tbody>
              {
                customerOrders.map((order: any) => {
                  const {code, totalWithTax, totalQuantity, updatedAt, state, currencyCode } = order
                  return (
                    <tr
                      key={code}
                      className="border-b border-opacity-20 border-gray-300 bg-gray-50 cursor-pointer hover:bg-accent-2 p-2 transition ease-in hover:underline hover:text-accent-3"
                      onClick={(e) => onClickOrder(e, code)}
                    >
                      <td className="p-3 text-center">
                        <span className="p-2">
                          <span>{(new Date(updatedAt)).toLocaleString('es-ES')}</span>
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <p>{code}</p>
                      </td>
                      <td className="p-3 text-center">
                        <p className="px-3 py-1 font-semibold rounded-md bg-accent-2 border-2 border-gray-300">
                          {state}
                        </p>
                      </td>
                      <td className="p-3 text-center">
                        <p>{getFormattedPrice(totalWithTax, currencyCode)}</p>
                      </td>
                      <td className="p-3 text-center">
                        <p>{totalQuantity}</p>
                      </td>
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!customerOrders && !error && (
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
  )
}

CustomerOrdersPage.Layout = Layout
