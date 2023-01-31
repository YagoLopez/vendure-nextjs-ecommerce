import { GraphQLClient, gql } from 'graphql-request'

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

  constructor(private gqlEndpoint: string, private authCookie: string) {}

  async getActiveOrder(){
    const graphQLClient = new GraphQLClient(this.gqlEndpoint, {
      headers: { cookie: this.authCookie }
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
