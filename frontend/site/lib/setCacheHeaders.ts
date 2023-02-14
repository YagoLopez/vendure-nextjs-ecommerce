import { ServerResponse } from 'http'

export default function setCacheHeaders(res: ServerResponse, maxAge: number = 10, staleTime: number = 59): void {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleTime}`
  )
}
