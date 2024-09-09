import {
  Flex,
  Grid,
  MantineTheme,
  Space,
  Table,
  Text,
  Box,
  getPrimaryShade,
  Group,
  Stack,
  Title,
  Divider
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { Placement } from 'adex-common'
import {
  formatDate,
  getMonthRangeString,
  monthPeriodIndexToDate,
  parseBigNumTokenAmountToDecimal,
  formatCurrency
} from 'helpers'
import { PropsWithChildren, ReactNode } from 'react'
import AdExLogo from 'resources/logos/AdExLogo'
import { IInvoiceDetails, InvoiceCompanyDetails, OperationEntry, StatementData } from 'types'
import { networks } from 'lib/Icons'
import { useColorScheme } from '@mantine/hooks'

type InvoicesPDFProps = { invoiceDetails: IInvoiceDetails; placement: Placement }
type SidesDetails = {
  seller: InvoiceCompanyDetails & { email: string; website: string }
  buyer: InvoiceCompanyDetails
}

type StatementsPDFProps = SidesDetails & {
  statement: StatementData
}

type DetailsProps = PropsWithChildren &
  SidesDetails & {
    title: string
    header: ReactNode
  }

const formatTokenAmount = (amount: bigint, token: OperationEntry['token']): string => {
  return `${formatCurrency(parseBigNumTokenAmountToDecimal(amount, token.decimals), 2)}`
}

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)
  return {
    wrap: {
      wordBreak: 'break-word'
    },
    noWrap: {
      whiteSpace: 'nowrap'
    },

    tableHeader: {
      backgroundColor: theme.colors.alternativeBackground[primaryShade]
    },
    tableBody: {
      backgroundColor: theme.colors.lightBackground[primaryShade]
    },
    tableWrapper: {
      borderRadius: theme.radius.sm,
      overflow: 'hidden'
    }
  }
})

const BillingBlank = ({ children, header, seller, buyer, title }: DetailsProps) => {
  const { classes } = useStyles()

  return (
    <Stack fz="xs" p="xs" m={0} gap="lg">
      <Group justify="space-between" align="center">
        <Box w={160}>
          <AdExLogo />
        </Box>
        {/* TODO: fix the size to be without px */}
        <Title order={2} fw="bold">
          {title}
        </Title>
      </Group>

      <Stack>
        <Group grow align="top">
          <Stack>
            <Stack gap="0">
              <span>{`${title} to:`} </span>
              <span className={classes.bold}>{buyer.companyName}</span>
              <Space h="md" />
              <span>{buyer.companyAddress}</span>
              <span>{buyer.companyCity}</span>
              <span>{buyer.companyCountry}</span>
            </Stack>

            <Stack gap="0">
              <span>Reg. No.: {buyer.companyNumber}</span>
              <span>VAT Reg. No.: {buyer.companyNumberPrim}</span>
              <span>ETH Address: {buyer.ethAddress}</span>
            </Stack>
          </Stack>

          <div className={classes.wrapper}>{header}</div>
        </Group>

        <Space h="md" />
        {children}
        <Space h="lg" />
        <Divider />
        <Stack className={classes.footer}>
          <Group grow>
            <Stack gap="0">
              <Text size="sm" fw="bold">
                {seller.companyName}
              </Text>
              <Space h="md" />
              <Space h="md" />
              <span>{seller.companyAddress}</span>
              <span>{seller.companyCity}</span>
              <span>{seller.companyCountry}</span>
            </Stack>

            <Stack ta="right" gap="0" className={classes.wrap}>
              <span>Email: {seller.email}</span>
              <span>Website: {seller.website}</span>

              <Space h="md" />
              <span>Reg. No.: {seller.companyNumber}</span>
              <span>VAT Reg. No.: {seller.companyNumberPrim}</span>
              <span>ETH Address: {seller.ethAddress}</span>
            </Stack>
          </Group>
        </Stack>
      </Stack>
    </Stack>
  )
}

export const InvoicesPDF = ({ invoiceDetails, placement }: InvoicesPDFProps) => {
  const { classes, cx } = useStyles()

  const calculatedVatValue = invoiceDetails.amount * (invoiceDetails.vatPercentageInUSD / 100)
  const invoiceTotal = invoiceDetails.amount + calculatedVatValue
  return (
    <BillingBlank
      title="Invoice"
      seller={invoiceDetails.seller}
      buyer={invoiceDetails.buyer}
      header={
        <Stack gap="0">
          <Group
            justify="space-between"
            align="baseline"
            className={cx(classes.tableHeader, classes.tableWrapper)}
            p="xs"
            wrap="nowrap"
          >
            <Text c="secondaryText" className={classes.noWrap}>
              Invoice No.:
            </Text>
            <Text size="sm" fw="bold" className={classes.wrap}>
              {invoiceDetails.invoiceId}
            </Text>
          </Group>
          <Space h="md" />
          <Group justify="space-between">
            <Text c="secondaryText">Invoice Date:</Text>
            <Text c="secondaryText">
              {invoiceDetails.invoiceDate ? formatDate(invoiceDetails.invoiceDate) : 'N/A'}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text c="secondaryText">Payment Date:</Text>
            <Text c="secondaryText">
              {invoiceDetails.paymentDate ? formatDate(invoiceDetails.paymentDate) : 'N/A'}
            </Text>
          </Group>
        </Stack>
      }
    >
      <Stack align="end">
        <Table
          fs="xs"
          verticalSpacing="xs"
          w="100%"
          className={classes.tableWrapper}
          withColumnBorders
        >
          <Table.Thead className={classes.tableHeader}>
            <Table.Tr>
              <Table.Th>Placement</Table.Th>
              <Table.Th className={classes.rightAlignedText}>Impressions</Table.Th>
              <Table.Th className={classes.rightAlignedText}>Clicks</Table.Th>
              <Table.Th>CTR %</Table.Th>
              <Table.Th>
                <span>Average CPM</span>
                <br />
                <span>({invoiceDetails.currencyName})</span>
              </Table.Th>
              <Table.Th>
                <span>Spent</span>
                <br />
                <span>({invoiceDetails.currencyName})</span>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className={classes.tableBody}>
            <Table.Tr>
              <Table.Td className={classes.wrap}>{placement}</Table.Td>
              <Table.Td className={classes.rightAlignedText}>
                {invoiceDetails.impressions.toLocaleString()}
              </Table.Td>
              <Table.Td className={classes.rightAlignedText}>
                {invoiceDetails.clicks.toLocaleString()}
              </Table.Td>
              <Table.Td className={classes.rightAlignedText}>{invoiceDetails.ctr}</Table.Td>
              <Table.Td className={classes.rightAlignedText}>{invoiceDetails.avgCpm}</Table.Td>
              <Table.Td className={classes.rightAlignedText}>
                {invoiceDetails.amount.toFixed(4)}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        <Stack w="50%" gap="xs">
          <Group grow justify="space-between">
            <Text>Subtotal</Text>
            <Text ta="end">{invoiceDetails.amount.toFixed(2)} </Text>
          </Group>
          <Group grow justify="space-between">
            <Text> {`VAT ${invoiceDetails.vatPercentageInUSD} %`}</Text>
            <Text ta="end">
              {`${calculatedVatValue.toFixed(2)}${
                invoiceDetails.vatPercentageInUSD === 0 ? '*' : ''
              }`}
            </Text>
          </Group>
          <Divider />
          <Group grow justify="space-between">
            <Text fw="bold">{`Invoice total (${invoiceDetails.currencyName})`}</Text>
            <Text fw="bold" ta="end">
              {invoiceTotal.toFixed(2)}{' '}
            </Text>
          </Group>
        </Stack>
        {invoiceDetails.vatPercentageInUSD === 0 && (
          <Text size="xs" ta="end">
            * Services subject to reverse charge-VAT to be accounted for by the recipient as per
            Art.196 Council Directive 2006/112/EC
          </Text>
        )}
      </Stack>
    </BillingBlank>
  )
}

export const StatementsPDF = ({ statement, seller, buyer }: StatementsPDFProps) => {
  const { classes, cx } = useStyles()

  return (
    <BillingBlank
      title="Statement"
      seller={seller}
      buyer={buyer}
      header={
        <>
          <Flex
            justify="space-between"
            className={cx(classes.tableHeader, classes.tableWrapper)}
            p="xs"
          >
            <Text c="secondaryText">Statement Period:</Text>
            <Text fw="bold">
              {getMonthRangeString(monthPeriodIndexToDate(statement.periodIndex))}
            </Text>
          </Flex>
          <Flex justify="space-between" pl="xs" pr="xs">
            <Text c="secondaryText">Currency / Token:</Text>
            <Text c="secondaryText">
              {statement.token.name} (chain: {networks[statement.token.chainId]})
            </Text>
          </Flex>
          <Flex justify="space-between" pl="xs" pr="xs">
            <Text c="secondaryText">Start balance:</Text>
            <Text c="secondaryText">
              {formatTokenAmount(statement.startBalance, statement.token)}
            </Text>
          </Flex>
          <Flex justify="space-between" pl="xs" pr="xs">
            <Text c="secondaryText">End balance:</Text>
            <Text c="secondaryText">
              {formatTokenAmount(statement.endBalance, statement.token)}
            </Text>
          </Flex>
        </>
      }
    >
      <>
        {/* <Table fontSize="xs" verticalSpacing="xs" w="100%" className={classes.tableWrapper}> */}
        <Table
          fs="xs"
          verticalSpacing="xs"
          w="100%"
          className={classes.tableWrapper}
          withColumnBorders
        >
          <Table.Thead className={classes.tableHeader}>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>amount ({statement.token.name})</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className={classes.tableBody}>
            {statement.operations.map((e, index) => (
              // eslint-disable-next-line
              <Table.Tr key={index}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{e.date.toLocaleDateString()}</Table.Td>
                <Table.Td>
                  <Text tt="capitalize">{e.name}</Text>
                </Table.Td>
                <Table.Td className={classes.wrap}>{e.id}</Table.Td>
                <Table.Td className={cx(classes.rightAlignedText, classes.noWrap)}>
                  {`${e.type === 'campaignOpen' ? '-' : '+'}   ${formatTokenAmount(
                    e.amount,
                    statement.token
                  )}`}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Grid.Col span={12}>
          <Space h="xl" />
          <Space h="xl" />
          <Divider variant="solid" />
        </Grid.Col>
        <Grid.Col span={12}>This is not a bill.</Grid.Col>
        <Grid.Col span={12}>
          This is a summary of account activity for the time period stated above
        </Grid.Col>
      </>
    </BillingBlank>
  )
}
