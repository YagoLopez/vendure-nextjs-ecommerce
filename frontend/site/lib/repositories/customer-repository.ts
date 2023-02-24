import { GraphQLClient, gql } from 'graphql-request'

export default class CustomerRepository {

  // todo: graphql client should be singleton class
  private graphQLClient = new GraphQLClient(String(process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL))

  constructor(private authCookie: string) {
    this.graphQLClient.setHeader('cookie', this.authCookie)
  }

  async getActiveCustomer() {
    const query = gql`
      query {
        activeCustomer {
          id
          title
          firstName
          lastName
          phoneNumber
          emailAddress
          addresses {
            id
            streetLine1
            streetLine2
            city
            province
            postalCode
            defaultShippingAddress
            defaultBillingAddress
          }
        }
      }
    `
    return this.graphQLClient.request(query)
  }

}

