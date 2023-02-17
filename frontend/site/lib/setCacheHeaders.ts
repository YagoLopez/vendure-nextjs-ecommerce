import { ServerResponse } from 'http'
import { formatPrice } from '@framework/product/use-price'

export default function setCacheHeaders(res: ServerResponse, maxAge: number = 10, staleTime: number = 59): void {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleTime}`
  )
}

export const getFormattedPrice = (price: number, currencyCode: string) =>
  formatPrice({amount: price/100, currencyCode, locale: currencyCode})
