import { Layout } from '@components/common'
import { Container, Rating } from '@components/ui'
import { ArrowLeft, Heart } from '@components/icons'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import OrdersRepository from '../../repositories/orders-repository'
import { useRouter } from 'next/router'
import Link from 'next/link'
import setCacheHeaders, { getFormattedPrice } from '@lib/misc'

export const getServerSideProps: GetServerSideProps<{order: Record<string, any> | null, error: string | null}> =
  async ({ req, res, query }) => {

    setCacheHeaders(res)

    const orderCode = String(query.code)
    let result

    try {
      const authCookie = String(req.headers.cookie)
      const ordersRepository = new OrdersRepository(authCookie)
      const { orderByCode } = await ordersRepository.getOrderByCode(orderCode)
      result = { order: orderByCode, error: null }
    } catch (e) {
      result = { order: null, error: (e as any).response?.errors[0].message ?? (e as any).message }
    }
    return {
      props: result
    }
  }

export default function OrderDetailPage({order, error}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    code, lines, subTotalWithTax, shipping, totalWithTax, taxSummary, currencyCode, state
  } = order as Record<string, any>
  const { push } = useRouter()
  const onClickProduct = (e: any, slug: string) => push(`/product/${slug}`)

  const subTotalWithTaxFormatted = getFormattedPrice(subTotalWithTax, currencyCode)
  const shippingFormatted = getFormattedPrice(shipping, currencyCode)
  const totalWithTaxFormatted = getFormattedPrice(totalWithTax, currencyCode)

  if (error) return (
    <>
      {error && (
        <Container className="pt-4">
          <div className="flex-1 px-4 flex flex-col justify-center items-center">
            <span className="pt-6 text-xl font-light text-center">
              {error}
            </span>
          </div>
        </Container>
      )}
    </>
  )

  return (
    <Container className="pt-4">
      <div className="lg:col-span-7">
        <div className="sm:px-6 flex-1">
          <div className="font-bold px-12 py-2 lg:text-2xl">
            <div>Order Code: <span className="font-light text-accent-4 text-xl lg:text-2xl">{code}</span></div>
          </div>
          <div className="font-medium px-12">
            <div>
              State: <span className="font-light text-accent-4">
                {state + ' '} {state === 'AddingItems' && (
              <Link href="/cart" className="font-light text-accent-4 hover:bg-accent-2">
                | Go to cart ➡️
              </Link>
            )}
              </span>
            </div>
            <div className="pb-1">Subtotal: <span className="font-light text-accent-4">{subTotalWithTaxFormatted}</span></div>
            <div className="pb-1">Included Tax Rate: <span className="font-light text-accent-4">{taxSummary[0]?.taxRate} %</span></div>
            <div className="pb-1">Shipping: <span className="font-light text-accent-4">{shippingFormatted}</span></div>
            <div className="pb-1">Total with taxes: <span className="font-light text-accent-4">{totalWithTaxFormatted}</span></div>
            <Link href="/orders" className="border-b flex font-light hover:text-accent-8 hover:underline py-2 text-accent-3 text-sm">
              <ArrowLeft/> Back
            </Link>
          </div>

          {(lines as Record<string, any>[]).map((line: any) => {
            const { productVariant, quantity, id, unitPriceWithTax } = line
            const { product } = productVariant
            return (
              <Container key={id} className="max-w-none w-full" clean>
                <section className="text-gray-700 body-font overflow-hidden bg-white">
                  <div className="container px-5 pt-[60px] mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                      <img alt="ecommerce"
                           onClick={(e) => onClickProduct(e, product.slug)}
                           className="lg:w-1/2 lg:h-[360px] w-full object-cover object-center rounded border border-gray-200 cursor-pointer transition duration-200 hover:scale-105"
                           src={product.featuredAsset.source}
                           title="Product Detail"
                      />
                      <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
                        <h1
                          onClick={(e) => onClickProduct(e, product.slug)}
                          className="text-gray-900 text-3xl title-font font-medium mb-1 cursor-pointer hover:text-accent-3" title="Product Detail">
                          {productVariant.name}
                        </h1>
                        <div className="flex mb-4">
                          <div className="flex flex-row justify-between items-center">
                            <Rating value={3} classes="py-0" />
                            <div className="text-accent-6 pl-3 font-xs text-xs lg:text-sm">36 reviews</div>
                          </div>
                        </div>
                        <p className="leading-relaxed mb-6">{product.description}</p>
                        <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                          <div className="flex">
                            <span className="mr-3">Quantity: {quantity}</span>
                          </div>
                        </div>
                        <div className="flex">
                          <span className="title-font font-medium text-2xl text-gray-900">
                            {getFormattedPrice(unitPriceWithTax, currencyCode)}
                          </span>
                          <button
                            className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded">Button
                          </button>
                          <button
                            onClick={() => alert('Add to favourites')}
                            className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 transition hover:scale-110"
                            title="Add to Favourites"
                          >
                            <Heart fill={'var(--accent-5)'} className="" />
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                </section>
                <hr className="mt-7 border-accent-2" />
              </Container>
          )})}
        </div>
      </div>
    </Container>
  )
}

OrderDetailPage.Layout = Layout
