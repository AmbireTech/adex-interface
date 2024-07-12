import { useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Loader,
  Flex,
  Box,
  Badge

  //  Flex, Loader, Tabs
} from '@mantine/core'

import CustomTable from 'components/common/CustomTable'
import useAdmin from 'hooks/useAdmin'

import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'

const headingsDefault = [
  'Id',
  'verified billing',
  'email',
  'balance',
  'campaigns launched',
  'total spend',
  'created'
]

const AdminAnalytics = () => {
  const navigate = useNavigate()
  const { accounts, initialDataLoading, updateAccounts } = useAdmin()
  const headings = useMemo(() => [...headingsDefault], [])

  const data = useMemo(() => {
    if (!accounts.size) {
      return {
        elements: [],
        totalDeposits: 0,
        totalCampaignsLocked: 0
      }
    }

    const accArr = Array.from(accounts.values())
    // TODO: fix this when multy token
    const decimals = accArr[0].balanceToken?.decimals
    const totalDeposits = parseBigNumTokenAmountToDecimal(
      accArr.reduce((sum, a) => sum + BigInt(a.fundsDeposited.total), 0n),
      decimals
    ).toLocaleString()
    const totalCampaignsLocked = parseBigNumTokenAmountToDecimal(
      accArr.reduce(
        (sum, a) => sum + BigInt(a.fundsOnCampaigns.total - a.refundsFromCampaigns.total),
        0n
      ),
      decimals
    ).toLocaleString()

    const elements = accArr
      .sort((a, b) => Number(b.availableBalance) - Number(a.availableBalance))
      .map((a) => {
        return {
          id: a.id,
          accountId: a.name || a.id,
          verified: a?.billingDetails?.verified ? '✅' : '❌',
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

  useEffect(() => {
    updateAccounts()
  }, [updateAccounts])

  const handlePreview = useCallback(
    (item: { id: string }) => {
      navigate(`/dashboard/admin/user-account/${item.id}`, {})
    },
    [navigate]
  )

  return (
    <Container fluid>
      {initialDataLoading ? (
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
          <CustomTable
            background
            headings={headings}
            elements={data.elements}
            pageSize={10}
            onPreview={handlePreview}
          />
        </Flex>
      )}
    </Container>
  )
}

export default AdminAnalytics
