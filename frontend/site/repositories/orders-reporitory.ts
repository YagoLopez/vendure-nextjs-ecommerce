import { GraphQLClient, gql } from 'graphql-request'
import { TmpCookiesObj } from 'cookies-next/lib/types'

export default class OrdersRepository {

  private query = gql`
    query {
      activeOrder {
        id
        state
        lines {
          productVariant {
            name
            product {
              featuredAsset {
                source
              }
            }
          }
          items {
            unitPrice
          }
        }
      }
    }
  `

  constructor(private gqlEndpoint: string, private cookies: TmpCookiesObj) {}

  async getActiveOrder(){
    const sessionCookie =
      `session=${this.cookies['session']}; session.sig=${this.cookies['session.sig']}`

    const graphQLClient = new GraphQLClient(this.gqlEndpoint, {
      headers: { Cookie: sessionCookie },
    })
    return await graphQLClient.request(this.query)
  }

}


// todo: set shipping method in checkout flow
/*
mutation SetShippingMethod {
  setOrderShippingMethod(shippingMethodId: 1) {
  ... on Order {
      id
    }
  ... on ErrorResult {
      errorCode
      message
    }
  }
}
*/
