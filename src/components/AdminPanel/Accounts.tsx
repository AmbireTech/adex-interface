import { useEffect, useMemo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, Box, Badge, TextInput, Stack, Group } from '@mantine/core'

import CustomTable from 'components/common/CustomTable'
import useAdmin from 'hooks/useAdmin'
import VisibilityIcon from 'resources/icons/Visibility'

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
  const { accounts, initialDataLoading, getAllAccounts } = useAdmin()
  const headings = useMemo(() => [...headingsDefault], [])
  const [search, setSearch] = useState('')

  const data = useMemo(() => {
    if (!accounts.size) {
      return {
        elements: [],
        totalDeposits: 0,
        totalCampaignsLocked: 0
      }
    }

    const accArr = Array.from(accounts.values())
    // TODO: fix this when multi token
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
    const totalAccounts = accArr.length

    const elements = accArr
      .filter((x) =>
        (
          x.name +
          x.id +
          (x.info?.contactPerson || '') +
          (x.info?.email || '') +
          (x.info?.notes || '') +
          (x.info?.phone || '') +
          (x.billingDetails?.companyAddress || '') +
          (x.billingDetails?.companyCity || '') +
          (x.billingDetails?.companyCountry || '') +
          (x.billingDetails?.companyName || '') +
          (x.billingDetails?.companyNumber || '') +
          (x.billingDetails?.companyNumberPrim || '') +
          (x.billingDetails?.companyZipCode || '') +
          (x.billingDetails?.firstName || '') +
          (x.billingDetails?.lastName || '')
        )
          .toLowerCase()
          .includes(search.toLowerCase().trim())
      )
      .sort(
        (a, b) =>
          b.fundsOnCampaigns.perCampaign.length - a.fundsOnCampaigns.perCampaign.length ||
          Number(b.fundsDeposited.total) - Number(a.fundsDeposited.total) ||
          Number(b.availableBalance) - Number(a.availableBalance)
      )
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
      totalAccounts,
      totalDeposits,
      totalCampaignsLocked
    }
  }, [accounts, search])

  useEffect(() => {
    getAllAccounts()
  }, [getAllAccounts])

  const handlePreview = useCallback(
    (item: { id: string }) => {
      navigate(`/dashboard/admin/user-account/${item.id}`, {})
    },
    [navigate]
  )

  const actions = useMemo(() => {
    return [
      {
        action: handlePreview,
        label: 'Show Account Details',
        icon: <VisibilityIcon />
      }
    ]
  }, [handlePreview])

  return initialDataLoading ? (
    <Loader size="xl" type="dots" color="violet" />
  ) : (
    <Stack>
      <Group align="center" justify="left" gap="xs" mb="md" wrap="wrap">
        <Box>Totals: </Box>
        <Badge leftSection="Accounts" size="lg">
          ({data.totalAccounts})
        </Badge>
        <Badge leftSection="Deposits" size="lg">
          ({data.totalDeposits} USDC)
        </Badge>
        <Badge leftSection="Campaigns" size="lg">
          ({data.totalCampaignsLocked} USDC)
        </Badge>
        <TextInput
          size="sm"
          placeholder="Search by id, name, info, billing data etc."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          miw={420}
        />
      </Group>
      <CustomTable headings={headings} elements={data.elements} pageSize={10} actions={actions} />
    </Stack>
  )
}

export default AdminAnalytics
