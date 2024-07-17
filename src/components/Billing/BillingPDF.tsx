import { Flex, Grid, MantineTheme, Space, Table, Text, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { Placement } from 'adex-common'
import {
  formatDate,
  getHumneSrcName,
  getMonthRangeString,
  monthPeriodIndexToDate,
  parseBigNumTokenAmountToDecimal,
  formatCurrency
} from 'helpers'
// TODO: delete mock data
// import { invoiceDetails } from 'components/Billing/mockedData'
import { useMemo, PropsWithChildren, ReactNode } from 'react'
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
  return `${formatCurrency(parseBigNumTokenAmountToDecimal(amount, token.decimals), 2)} ${
    token.name
  }`
}

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)
  return {
    wrapper: {
      color: theme.colors.secondaryText[primaryShade],
      fontSize: theme.fontSizes.xs,
      span: {
        display: 'block',
        wordBreak: 'break-word'
      }
    },
    title: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.other.fontWeights.bold
    },
    right: {
      textAlign: 'end'
    },
    bold: {
      fontWeight: theme.other.fontWeights.bold,
      color: theme.colors.mainText[primaryShade]
    },
    italic: {
      fontStyle: 'italic'
    },
    wrap: {
      wordBreak: 'break-word'
    },
    noWrap: {
      whiteSpace: 'nowrap'
    },
    smallFontSize: {
      fontSize: theme.fontSizes.xs
    },
    borderBottom: { borderBottom: '1px solid black', width: '100%', height: '70%' },
    signature: { display: 'flex', justifyContent: 'center', fontSize: theme.fontSizes.xs },
    rightAlignedText: {
      textAlign: 'end'
    },
    head: {
      background: theme.black,
      padding: theme.spacing.xl,
      color: 'white'
    },
    logo: {
      width: 200
    },
    footer: {
      borderTop: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade]
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
  const { classes, cx } = useStyles()

  return (
    <Grid grow align="center" className={classes.smallFontSize} p={0} m={0}>
      <Grid.Col span={12} className={classes.head}>
        <Flex justify="space-between" align="center">
          <div className={classes.logo}>
            <AdExLogo text="white" />
          </div>
          {/* TODO: fix the size to be without px */}
          <Text size="64px" fw="bold">
            {title}
          </Text>
        </Flex>
      </Grid.Col>
      <Grid.Col span={12}>
        <Grid p="xl">
          <Grid.Col span={6}>
            <div className={classes.wrapper}>
              <span>{`${title} to:`} </span>
              <span className={classes.bold}>{buyer.companyName}</span>
              <Space h="lg" />
              <span>{buyer.companyAddress}</span>
              <span>{buyer.companyCity}</span>
              <span>{buyer.companyCountry}</span>
            </div>
            <Space h="lg" />
            <div className={classes.wrapper}>
              <span>Reg. No.: {buyer.companyNumber}</span>
              <span>VAT Reg. No.: {buyer.companyNumberPrim}</span>
              <span>ETH Address: {buyer.ethAddress}</span>
            </div>
          </Grid.Col>
          <Grid.Col span={6}>{header}</Grid.Col>
          <Grid.Col span={12}>
            <Space h="lg" />
            {children}
          </Grid.Col>
          <Grid.Col span={12} className={classes.footer}>
            <Grid>
              <Grid.Col span={5}>
                <div className={classes.wrapper}>
                  <span className={classes.bold}>{seller.companyName}</span>
                  <Space h="md" />
                  <span>{seller.companyAddress}</span>
                  <span>{seller.companyCity}</span>
                  <span>{seller.companyCountry}</span>
                </div>
              </Grid.Col>
              <Grid.Col span={7}>
                <div className={cx(classes.wrapper, classes.right)}>
                  <Flex justify="space-between" w="100%">
                    <span>Email: {seller.email}</span>
                    <span>Website: {seller.website}</span>
                  </Flex>
                  <Space h="md" />
                  <span>Reg. No.: {seller.companyNumber}</span>
                  <span>VAT Reg. No.: {seller.companyNumberPrim}</span>
                  <span>ETH Address: {seller.ethAddress}</span>
                </div>
              </Grid.Col>
            </Grid>
            <Space h="lg" />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  )
}

export const InvoicesPDF = ({ invoiceDetails, placement }: InvoicesPDFProps) => {
  const { classes, cx } = useStyles()

  const calculateTotal = useMemo(() => {
    return invoiceDetails.invoiceData.map((item) => item.paid).reduce((a, b) => a + b, 0)
  }, [invoiceDetails.invoiceData])

  const calculatedVatValue = calculateTotal * (invoiceDetails.vatPercentageInUSD / 100)
  const invoiceTotal = calculateTotal + calculatedVatValue
  return (
    <BillingBlank
      title="Invoice"
      seller={invoiceDetails.seller}
      buyer={invoiceDetails.buyer}
      header={
        <>
          <Flex
            justify="space-between"
            className={cx(classes.tableHeader, classes.tableWrapper, classes.wrap)}
            p="xs"
          >
            <Text c="secondaryText">Invoice No.:</Text>
            <Text fw="bold">{invoiceDetails.invoiceId}</Text>
          </Flex>
          <Flex justify="space-between" pl="xs" pr="xs">
            <Text c="secondaryText">Invoice Date:</Text>
            <Text c="secondaryText">
              {invoiceDetails.invoiceDate ? formatDate(invoiceDetails.invoiceDate) : 'N/A'}
            </Text>
          </Flex>
          <Flex justify="space-between" pl="xs" pr="xs">
            <Text c="secondaryText">Payment Date:</Text>
            <Text c="secondaryText">
              {invoiceDetails.paymentDate ? formatDate(invoiceDetails.paymentDate) : 'N/A'}
            </Text>
          </Flex>
        </>
      }
    >
      <>
        {/* <Table fontSize="xs" verticalSpacing="xs" w="100%" className={classes.tableWrapper}> */}
        <Table fs="xs" verticalSpacing="xs" w="100%" className={classes.tableWrapper}>
          <Table.Thead className={classes.tableHeader}>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>{placement === 'app' ? 'App' : 'Website'}</Table.Th>
              <Table.Th>Impressions</Table.Th>
              <Table.Th>Clicks</Table.Th>
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
            {invoiceDetails.invoiceData.map((e, index) => (
              // eslint-disable-next-line
              <Table.Tr key={index}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td className={classes.wrap}>
                  {getHumneSrcName(e.segment, placement)}
                </Table.Td>
                <Table.Td className={classes.rightAlignedText}>
                  {e.impressions.toLocaleString()}
                </Table.Td>
                <Table.Td className={classes.rightAlignedText}>
                  {e.clicks.toLocaleString()}
                </Table.Td>
                <Table.Td className={classes.rightAlignedText}>{e.ctr}</Table.Td>
                <Table.Td className={classes.rightAlignedText}>{e.avgCpm}</Table.Td>
                <Table.Td className={classes.rightAlignedText}>{e.paid.toFixed(4)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Grid.Col span={12}>
          <Grid justify="end">
            <Grid.Col span={10} className={cx(classes.right)}>
              Subtotal
            </Grid.Col>
            <Grid.Col span={2} className={cx(classes.right)}>
              {calculateTotal.toFixed(2)}
            </Grid.Col>
            <Grid.Col span={10} className={cx(classes.right)}>
              {`VAT ${invoiceDetails.vatPercentageInUSD} %`}
            </Grid.Col>
            <Grid.Col span={2} className={cx(classes.right, classes.borderBottom)}>
              {`${calculatedVatValue.toFixed(2)}${
                invoiceDetails.vatPercentageInUSD === 0 ? '*' : ''
              }`}
            </Grid.Col>
            <Grid.Col span={10} className={cx(classes.right, classes.bold)}>
              {`Invoice total (${invoiceDetails.currencyName})`}
            </Grid.Col>
            <Grid.Col span={2} className={cx(classes.right, classes.bold)}>
              {invoiceTotal.toFixed(2)}
            </Grid.Col>
            {invoiceDetails.vatPercentageInUSD === 0 && (
              <Grid.Col span={10} className={cx(classes.right)}>
                * Services subject to reverse charge-VAT to be accounted for by the recipient as per
                Art.196 Council Directive 2006/112/EC
              </Grid.Col>
            )}
          </Grid>
        </Grid.Col>
      </>
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
        <Table fs="xs" verticalSpacing="xs" w="100%" className={classes.tableWrapper}>
          <Table.Thead className={classes.tableHeader}>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className={classes.tableBody}>
            {statement.operations.map((e, index) => (
              // eslint-disable-next-line
              <Table.Tr key={index}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{e.date.toLocaleDateString()}</Table.Td>
                <Table.Td>{e.type}</Table.Td>
                <Table.Td className={classes.wrap}>{e.id}</Table.Td>
                <Table.Td className={cx(classes.rightAlignedText, classes.noWrap)}>
                  {' '}
                  {`${e.type === 'campaign' ? '-' : '+'}   ${formatTokenAmount(
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
          <div className={classes.borderBottom} />
        </Grid.Col>
        <Grid.Col span={12}>This is not a bill.</Grid.Col>
        <Grid.Col span={12}>
          This is a summary of account activity for the time period stated above
        </Grid.Col>
      </>
    </BillingBlank>
  )
}
