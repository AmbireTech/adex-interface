import { useEffect, useState, useMemo } from 'react'
import {
  Container,
  Loader,
  Flex,
  Box,
  Badge

  //  Flex, Loader, Tabs
} from '@mantine/core'

import CustomTable from 'components/common/CustomTable'
import { useAdExApi } from 'hooks/useAdexServices'
import { Account } from 'types'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'

const headingsDefault = ['Id', 'email', 'balance', 'created']

const AdminAnalytics = () => {
  const { adexServicesRequest } = useAdExApi()
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<Array<Account>>([])
  const headings = useMemo(() => [...headingsDefault], [])

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await adexServicesRequest<Array<Account>>('backend', {
          route: '/dsp/admin/accounts/all',
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        })

        console.log({ res })
        setAccounts(res)
      } catch (err) {
        console.log({ err })
      }
      setLoading(false)
    }

    getData()
  }, [adexServicesRequest])

  const data = useMemo(() => {
    const elements = accounts
      .sort((a, b) => Number(b.availableBalance) - Number(a.availableBalance))
      .map((a) => {
        return {
          id: a.id,
          accountId: a.id,
          email: a.info?.email,
          balance: parseBigNumTokenAmountToDecimal(
            a.availableBalance,
            a.balanceToken.decimals
          ).toFixed(2),
          created: new Date(a.created).toLocaleDateString()
        }
      })

    return {
      elements
    }
  }, [accounts])

  return (
    <Container fluid>
      {loading ? (
        <Loader size="xl" variant="dots" color="violet" />
      ) : (
        <Flex direction="column">
          <Flex direction="row" align="center" justify="left" gap="xl" mb="md">
            <Box>Totals: </Box>
            <Badge leftSection="Accounts" size="xl">
              {data.elements.length}
            </Badge>
          </Flex>
          <CustomTable background headings={headings} elements={data.elements} pageSize={10} />
        </Flex>
      )}
    </Container>
  )
}

export default AdminAnalytics
