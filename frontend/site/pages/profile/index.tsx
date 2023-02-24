import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import setCacheHeaders from '@lib/misc'
import CustomerRepository from '@lib/repositories/customer-repository'
import ProfileInfo from './ProfileInfo'

export const getServerSideProps: GetServerSideProps<any> =
  async ({ req, res }) => {

    setCacheHeaders(res)

    let props, notFound

    try {
      const authCookie = String(req.headers.cookie)
      const customerRepository = new CustomerRepository(authCookie)
      const { activeCustomer  } = await customerRepository.getActiveCustomer()
      props = { activeCustomer }
      if (!activeCustomer) notFound = true
    } catch (e) {
      notFound = true
    }
    return {
      props,
      notFound
    }
  }

export default function Index({ activeCustomer }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { firstName, lastName, phoneNumber, emailAddress, addresses: [ address ] } = activeCustomer
  const { streetLine1, streetLine2, city, province, postalCode } = address
  return (
    <Container className="py-4 md:py-8 md:w-[60%]">
      <Text variant="pageHeading">My Profile</Text>
        {activeCustomer && (
          <div className="flex flex-col divide-accent-2 divide-y">
            <ProfileInfo name={'Full Name'} info={`${firstName} ${lastName}`} />
            <ProfileInfo name={'Email'} info={emailAddress} />
            <ProfileInfo name={'Address'} info={`${streetLine1} - ${streetLine2}`} />
            <ProfileInfo name={'Phone Number'} info={phoneNumber} />
            <ProfileInfo name={'City'} info={city} />
            <ProfileInfo name={'Province'} info={province} />
            <ProfileInfo name={'Postal Code'} info={postalCode} />
          </div>
        )}
    </Container>
  )
}

Index.Layout = Layout
