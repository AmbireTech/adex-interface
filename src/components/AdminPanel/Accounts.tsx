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

const headingsDefault = ['Id', 'email', 'balance', 'campaigns launched', 'total spend', 'created']

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
    // TODO: fix this when multy token
    const decimals = accounts[0].balanceToken.decimals
    const totalDeposits = parseBigNumTokenAmountToDecimal(
      accounts?.reduce((sum, a) => sum + BigInt(a.fundsDeposited.total), 0n),
      decimals
    ).toLocaleString()
    const totalCampaignsLocked = parseBigNumTokenAmountToDecimal(
      accounts?.reduce(
        (sum, a) => sum + BigInt(a.fundsOnCampaigns.total - a.refundsFromCampaigns.total),
        0n
      ),
      decimals
    ).toLocaleString()

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
          campaigns: a.fundsOnCampaigns.perCampaign.length,
          fudsOnCampaigns: parseBigNumTokenAmountToDecimal(
            a.fundsOnCampaigns.total - a.refundsFromCampaigns.total,
            a.balanceToken.decimals
          ).toFixed(2),
          created: new Date(a.created).toLocaleDateString()
        }
      })

    return {
      elements,
      totalDeposits,
      totalCampaignsLocked
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
              ({data.elements.length})
            </Badge>
            <Badge leftSection="Deposits" size="xl">
              ({data.totalDeposits} USDC)
            </Badge>
            <Badge leftSection="Campaigns" size="xl">
              ({data.totalCampaignsLocked} USDC)
            </Badge>
          </Flex>
          <CustomTable background headings={headings} elements={data.elements} pageSize={10} />
        </Flex>
      )}
    </Container>
  )
}

export default AdminAnalytics
