import { Grid, Space, Table, createStyles } from '@mantine/core'
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
import { IInvoiceDetails, InvoiceCompanyDetails, OperationEntry, StatementData } from 'types'

type InvoicesPDFProps = { invoiceDetails: IInvoiceDetails; placement: Placement }
type SidesDetails = {
  seller: InvoiceCompanyDetails
  buyer: InvoiceCompanyDetails
}

type StatementsPDFProps = SidesDetails & {
  statement: StatementData
}

type DetailsProps = PropsWithChildren &
  SidesDetails & {
    header: ReactNode
    footer: ReactNode
  }

const formatTokenAmount = (amount: bigint, token: OperationEntry['token']): string => {
  return `${formatCurrency(parseBigNumTokenAmountToDecimal(amount, token.decimals), 2)} ${
    token.name
  }`
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    color: theme.colors.secondaryText[theme.fn.primaryShade()],
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
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    alignItems: 'end'
  },
  bold: {
    fontWeight: theme.other.fontWeights.bold,
    color: theme.colors.mainText[theme.fn.primaryShade()]
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
  }
}))

const BillingBlank = ({ children, header, footer, seller, buyer }: DetailsProps) => {
  const { classes } = useStyles()

  return (
    <Grid grow align="center" className={classes.smallFontSize} p={12}>
      <Grid.Col span={12}>{header}</Grid.Col>
      <Grid.Col span={6}>
        <div className={classes.wrapper}>
          <span className={classes.italic}>Seller</span>
          <span className={classes.bold}>{seller.companyName}</span>
          <span>{seller.companyAddress}</span>
          <span>{seller.companyCity}</span>
          <span>{seller.companyCountry}</span>
        </div>
        <Space h="xl" />
        <div className={classes.wrapper}>
          <span>Reg. No.: {seller.companyNumber}</span>
          <span>VAT Reg. No.: {seller.companyNumberPrim}</span>
          <span>ETH Address: {seller.ethAddress}</span>
        </div>
      </Grid.Col>
      <Grid.Col span={6}>
        <div className={classes.wrapper}>
          <span className={classes.italic}>Buyer</span>
          <span className={classes.bold}>{buyer.companyName}</span>
          <span>{buyer.companyAddress}</span>
          <span>{buyer.companyCity}</span>
          <span>{buyer.companyCountry}</span>
        </div>
        <Space h="xl" />
        <div className={classes.wrapper}>
          <span>Reg. No.: {buyer.companyNumber}</span>
          <span>VAT Reg. No.: {buyer.companyNumberPrim}</span>
          <span>ETH Address: {buyer.ethAddress}</span>
        </div>
      </Grid.Col>

      <Grid.Col span={12}>
        <Space h="xl" />
        <Space h="xl" />
        {children}
      </Grid.Col>
      <Grid.Col span={12}>
        <Space h="xl" />
        {footer}
        <Space h="xl" />
      </Grid.Col>
    </Grid>
  )
}

export const InvoicesPDF = ({ invoiceDetails, placement }: InvoicesPDFProps) => {
  const { classes, cx } = useStyles()

  const calculateTotal = useMemo(() => {
    return invoiceDetails.invoiceData.map((item) => item.paid).reduce((a, b) => a + b, 0)
  }, [invoiceDetails.invoiceData])

  return (
    <BillingBlank
      seller={invoiceDetails.seller}
      buyer={invoiceDetails.buyer}
      header={
        <div className={classes.right}>
          <div className={classes.title}>VAT Invoice</div>
          <div className={classes.title}>No. {invoiceDetails.invoiceId}</div>
          <span>{formatDate(invoiceDetails.invoiceDate)}</span>
        </div>
      }
      footer={
        <Grid>
          <Grid.Col span={9} className={cx(classes.right, classes.bold)}>
            {`Total Exl. VAT, ${invoiceDetails.currencyName}`}
          </Grid.Col>
          <Grid.Col span={2} className={cx(classes.right, classes.bold)}>
            {calculateTotal.toFixed(2)}
          </Grid.Col>
          <Grid.Col span={9} className={cx(classes.right, classes.bold)}>
            {`VAT 0%, ${invoiceDetails.currencyName}`}
          </Grid.Col>
          <Grid.Col span={2} className={cx(classes.right, classes.bold)}>
            {invoiceDetails.vatPercentageInUSD.toFixed(2)}
          </Grid.Col>
          <Grid.Col span={9} className={cx(classes.right, classes.bold)}>
            {`Total Incl. VAT, ${invoiceDetails.currencyName}`}
          </Grid.Col>
          <Grid.Col span={2} className={cx(classes.right, classes.bold)}>
            {(calculateTotal + invoiceDetails.vatPercentageInUSD).toFixed(2)}
          </Grid.Col>
          <Grid.Col span={6}>
            Seller
            <div className={classes.borderBottom} />
            <span className={classes.signature}>Title / Name / Signature</span>
          </Grid.Col>
          <Grid.Col span={6}>
            Buyer
            <div className={classes.borderBottom} />
            <span className={classes.signature}>Title / Name / Signature</span>
          </Grid.Col>
        </Grid>
      }
    >
      <Table withBorder withColumnBorders fontSize="xs" verticalSpacing="xs" w="100%">
        <thead>
          <tr>
            <th>No.</th>
            <th>{placement === 'app' ? 'App' : 'Website'}</th>
            <th>Impressions</th>
            <th>Clicks</th>
            <th>CTR %</th>
            <th>
              <span>Average CPM</span>
              <br />
              <span>({invoiceDetails.currencyName})</span>
            </th>
            <th>
              <span>Spent</span>
              <br />
              <span>({invoiceDetails.currencyName})</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceDetails.invoiceData.map((e, index) => (
            // eslint-disable-next-line
            <tr key={index}>
              <td>{index + 1}</td>
              <td className={classes.wrap}>{getHumneSrcName(e.segment, placement)}</td>
              <td className={classes.rightAlignedText}>{e.impressions.toLocaleString()}</td>
              <td className={classes.rightAlignedText}>{e.clicks.toLocaleString()}</td>
              <td className={classes.rightAlignedText}>{e.ctr}</td>
              <td className={classes.rightAlignedText}>{e.avgCpm}</td>
              <td className={classes.rightAlignedText}>{e.paid.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </BillingBlank>
  )
}

export const StatementsPDF = ({ statement, seller, buyer }: StatementsPDFProps) => {
  const { classes, cx } = useStyles()

  return (
    <BillingBlank
      seller={seller}
      buyer={buyer}
      header={
        <Grid.Col span={12}>
          <div className={classes.right}>
            <div className={classes.title}>Statement</div>
            <div className={classes.title}>
              Period {getMonthRangeString(monthPeriodIndexToDate(statement.periodIndex))}
            </div>
            <span>
              {/* TODO: chain id to name */}
              Currency / Token: {statement.token.name} (chain: {statement.token.chainId})
            </span>
          </div>
        </Grid.Col>
      }
      footer={
        <>
          <Grid.Col span={12} className={cx(classes.right, classes.bold)}>
            {`End balance, ${formatTokenAmount(statement.endBalance, statement.token)}`}
          </Grid.Col>
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
      }
    >
      <>
        <Grid.Col span={9} className={cx(classes.right, classes.bold)}>
          {`Start balance, ${formatTokenAmount(statement.startBalance, statement.token)}`}
          <Space h="xl" />
        </Grid.Col>
        <Table withBorder withColumnBorders fontSize="xs" verticalSpacing="xs" w="100%">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>amount</th>
            </tr>
          </thead>
          <tbody>
            {statement.operations.map((e, index) => (
              // eslint-disable-next-line
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{e.date.toLocaleDateString()}</td>
                <td>{e.type}</td>
                <td className={classes.wrap}>{e.id}</td>
                <td className={cx(classes.rightAlignedText, classes.noWrap)}>
                  {' '}
                  {`${e.type === 'campaign' ? '-' : '+'}   ${formatTokenAmount(
                    e.amount,
                    statement.token
                  )}`}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    </BillingBlank>
  )
}
