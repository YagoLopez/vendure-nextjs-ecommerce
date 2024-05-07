import { GraphQLClient, gql } from 'graphql-request'
import { Address } from '@commerce/types/customer/address'

export default class OrdersRepository {

  private graphQLClient = new GraphQLClient(String(process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL))

  constructor(private authCookie: string) {
    this.graphQLClient.setHeader('cookie', this.authCookie)
  }

  async getActiveOrder() {
    const query = gql`
      query {
        activeOrder {
          id
          state
          code
          shipping
          currencyCode
          createdAt
          taxSummary{
            description
            taxBase
            taxRate
            taxTotal
          }
          customer {
            id
            addresses {
              id
              streetLine1
              streetLine2
              city
              province
              postalCode
              phoneNumber
              country {
                name
                code
              }
            }
          }
          subTotal
          subTotalWithTax
          total
          totalWithTax
          totalQuantity
          lines {
            id
            unitPrice
            taxRate
            unitPriceWithTax
            discountedUnitPriceWithTax
            featuredAsset {
              preview
            }
            productVariant {
              id
              name
              sku
              currencyCode
              product {
                id
                slug
                description
              }
            }
            quantity
            discounts {
              amount
              amountWithTax
            }
          }
        }
      }
    `
    return this.graphQLClient.request(query)
  }

  async getOrderByCode(code: string) {
    const query = gql`
      query getOrderByCode($code: String!) {
        orderByCode(code: $code) {
          id
          state
          code
          active
          currencyCode
          customer {
            addresses {
              id
              streetLine1
              streetLine2
              city
              province
              postalCode
              phoneNumber
              country {
                name
                code
              }
            }
          }
          subTotal
          subTotalWithTax
          shipping
          total
          totalWithTax
          totalQuantity
          taxSummary {
            taxBase
            taxRate
            taxTotal
            description
          }
          shippingWithTax
          lines {
            id
            unitPrice
            taxRate
            unitPriceWithTax
            productVariant {
              name
              currencyCode
              product {
                slug
                featuredAsset {
                  source
                }
                description
              }
            }
            quantity
          }
        }
      }
      `
    return this.graphQLClient.request(query, { code })
  }

  async setShippingAddress(address: Address) {
    const mutation = gql`
      mutation SetShippingAddress($input: CreateAddressInput!){
        setOrderShippingAddress(input: $input) {
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `
    return this.graphQLClient.request(mutation, { input: address })
  }

  async getShippingAddress() {
    const query = gql`
      query getActiveOrderShippingAddress {
        activeOrder {
          shippingAddress {
            streetLine1
            streetLine2
            city
            province
            postalCode
            country
            countryCode
            phoneNumber
          }
        }
      }
    `
    return this.graphQLClient.request(query)
  }

  getShippingAddressCustomer(customer: any) {
    const firstAddressData = customer.addresses[0]
    const countryCode = firstAddressData.country.code
    const shippingAddress = {...firstAddressData}
    shippingAddress.countryCode = countryCode
    delete shippingAddress.id
    delete shippingAddress.country
    return shippingAddress
  }

  async getShippingMethods() {
    const query = gql`
      query {
        eligibleShippingMethods {
          id
          name
          price
          priceWithTax
          code
        }
      }
    `
    return this.graphQLClient.request(query)
  }

  async setShippingMethod(shippingMethodId: number) {
    const query = gql`
      mutation($shippingMethodId: ID!) {
        setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `
    return this.graphQLClient.request(query, { shippingMethodId })
  }

  async getPaymentMethods() {
    const query = gql`
      query {
        eligiblePaymentMethods {
          id
          code
          name
        }
      }
    `
    return this.graphQLClient.request(query)
  }

  // todo: use enum for order state
  async transitionActiveOrderToState(state: string) {
    const query = gql`
      mutation TransitionOrder($state: String!) {
        transitionOrderToState(state: $state) {
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `
    return this.graphQLClient.request(query, {state})
  }

  async createPayment(){
    const { eligiblePaymentMethods } = await this.getPaymentMethods()
    if(!eligiblePaymentMethods.length) return {method: null}
    const paymentMethodData = eligiblePaymentMethods[0]
    const { code: method, name: metadata } = paymentMethodData
    return { method, metadata }
  }

  async addPayment(paymentData: Record<string, any>) {
    const query = gql`
      mutation AddPayment($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `
    return this.graphQLClient.request(query, { input: paymentData })
  }

  async getCustomerOrders() {
    const query = gql`
      query getCustomerOrders {
        activeCustomer {
          orders(options: { sort: { updatedAt: DESC } }) {
            items {
              state
              code
              totalWithTax
              totalQuantity
              updatedAt
              shipping
              currencyCode
            }
            totalItems
            __typename
          }
        }
      }
    `
    return this.graphQLClient.request(query)
  }

}

