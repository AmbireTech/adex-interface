import { Grid, Space, Table, createStyles } from '@mantine/core'
import { Placement } from 'adex-common'
import { formatDate, getHumneSrcName } from 'helpers'
// TODO: delete mock data
// import { invoiceDetails } from 'components/Billing/mockedData'
import { useMemo } from 'react'
import { IInvoiceDetails } from 'types'

type InvoicesPDFProps = { invoiceDetails: IInvoiceDetails; placement: Placement }

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
    maxWidth: 200,
    wordBreak: 'break-word'
  },
  smallFontSize: {
    fontSize: theme.fontSizes.xs
  },
  borderBottom: { borderBottom: '1px solid black', width: '90%', height: '70%' },
  signature: { display: 'flex', justifyContent: 'center', fontSize: theme.fontSizes.xs }
}))

const InvoicesPDF = ({ invoiceDetails, placement }: InvoicesPDFProps) => {
  const { classes, cx } = useStyles()

  const calculateTotal = useMemo(() => {
    return invoiceDetails.invoiceData.map((item) => item.paid).reduce((a, b) => a + b, 0)
  }, [invoiceDetails.invoiceData])

  return (
    <Grid grow align="center">
      <Grid.Col span={12}>
        <div className={classes.right}>
          <div className={classes.title}>VAT Invoice</div>
          <div className={classes.title}>No. {invoiceDetails.invoiceId}</div>
          <span className={classes.smallFontSize}>{formatDate(invoiceDetails.invoiceDate)}</span>
        </div>
      </Grid.Col>
      <Grid.Col span={6}>
        <div className={classes.wrapper}>
          <span className={classes.italic}>Seller</span>
          <span className={classes.bold}>{invoiceDetails.seller.companyName}</span>
          <span>{invoiceDetails.seller.companyAddress}</span>
          <span>{invoiceDetails.seller.companyCity}</span>
          <span>{invoiceDetails.seller.companyCountry}</span>
        </div>
        <Space h="xl" />
        <div className={classes.wrapper}>
          <span>Reg. No.: {invoiceDetails.seller.companyNumber}</span>
          <span>VAT Reg. No.: {invoiceDetails.seller.companyNumberPrim}</span>
          <span>ETH Address: {invoiceDetails.seller.ethAddress}</span>
        </div>
      </Grid.Col>
      <Grid.Col span={6}>
        <div className={classes.wrapper}>
          <span className={classes.italic}>Buyer</span>
          <span className={classes.bold}>{invoiceDetails.buyer.companyName}</span>
          <span>{invoiceDetails.buyer.companyAddress}</span>
          <span>{invoiceDetails.buyer.companyCity}</span>
          <span>{invoiceDetails.buyer.companyCountry}</span>
        </div>
        <Space h="xl" />
        <div className={classes.wrapper}>
          <span>Reg. No.: {invoiceDetails.buyer.companyNumber}</span>
          <span>VAT Reg. No.: {invoiceDetails.buyer.companyNumberPrim}</span>
          <span>ETH Address: {invoiceDetails.buyer.ethAddress}</span>
        </div>
      </Grid.Col>
      <Grid.Col span={12}>
        <Space h="xl" />
        <Space h="xl" />
        <Table withBorder withColumnBorders fontSize="xs">
          <thead>
            <tr>
              <th>No.</th>
              <th> {placement === 'app' ? 'App' : 'Website'}</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>CTR %</th>
              <th>Average CPM</th>
              <th>Spent</th>
            </tr>
          </thead>
          <tbody>
            {invoiceDetails.invoiceData.map((e, index) => (
              // eslint-disable-next-line
              <tr key={index}>
                <td>{index + 1}</td>
                <td className={classes.wrap}>{getHumneSrcName(e.segment, placement)}</td>
                <td className={classes.wrap}>{e.impressions.toLocaleString()}</td>
                <td className={classes.wrap}>{e.clicks.toLocaleString()}</td>
                <td className={classes.wrap}>{e.ctr}</td>
                <td className={classes.wrap}>{`${e.avgCpm} ${invoiceDetails.currencyName}`}</td>
                <td className={classes.wrap}>{`${e.paid.toFixed(4)} ${
                  invoiceDetails.currencyName
                }`}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={9} className={cx(classes.right, classes.bold, classes.smallFontSize)}>
        {`Total Exl. VAT, ${invoiceDetails.currencyName}`}
      </Grid.Col>
      <Grid.Col span={2} className={cx(classes.right, classes.bold, classes.smallFontSize)}>
        {calculateTotal.toFixed(2)}
      </Grid.Col>
      <Grid.Col span={9} className={cx(classes.right, classes.bold, classes.smallFontSize)}>
        {`VAT 0%, ${invoiceDetails.currencyName}`}
      </Grid.Col>
      <Grid.Col span={2} className={cx(classes.right, classes.bold, classes.smallFontSize)}>
        {invoiceDetails.vatPercentageInUSD.toFixed(2)}
      </Grid.Col>
      <Grid.Col span={9} className={cx(classes.right, classes.bold, classes.smallFontSize)}>
        {`Total Incl. VAT, ${invoiceDetails.currencyName}`}
      </Grid.Col>
      <Grid.Col span={2} className={cx(classes.right, classes.bold, classes.smallFontSize)}>
        {(calculateTotal + invoiceDetails.vatPercentageInUSD).toFixed(2)}
      </Grid.Col>
      <Grid.Col span={12}>
        <Space h="xl" />
      </Grid.Col>
      <Grid.Col span={4}>
        Seller
        <div className={classes.borderBottom} />
        <span className={classes.signature}>Title / Name / Signature</span>
      </Grid.Col>
      <Grid.Col span={4}>
        Buyer
        <div className={classes.borderBottom} />
        <span className={classes.signature}>Title / Name / Signature</span>
      </Grid.Col>
    </Grid>
  )
}

export default InvoicesPDF
