import { Grid, Space, Table, createStyles } from '@mantine/core'
import { formatDate } from 'helpers'
// TODO: delete mock data
// import { invoiceDetails } from 'components/Billing/mockedData'
import { useMemo } from 'react'
import { IInvoiceDetails } from 'types'

const useStyles = createStyles((theme) => ({
  wrapper: {
    color: theme.colors.secondaryText[theme.fn.primaryShade()],
    span: {
      display: 'block',
      wordBreak: 'break-word'
    }
  },
  title: {
    fontSize: theme.fontSizes.lg,
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
  }
}))

const InvoicesPDF = ({ invoiceDetails }: { invoiceDetails: IInvoiceDetails }) => {
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
          <span>{formatDate(invoiceDetails.invoiceDate)}</span>
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
        <Space h="xl" />
        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <th>No.</th>
              {/* TODO: check what the placement is */}
              {/* <th> {placement === 'app' ? 'App' : 'Website'}</th> */}
              <th>Website</th>
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
                <td>{e.segment}</td>
                <td>{e.impressions.toLocaleString()}</td>
                <td>{e.clicks.toLocaleString()}</td>
                <td>{e.ctr}</td>
                <td>{`${e.avgCpm} ${invoiceDetails.currencyName}`}</td>
                <td>{`${e.paid.toFixed(4)} ${invoiceDetails.currencyName}`}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Grid.Col>
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
      <Grid.Col span={12}>
        <Space h="xl" />
      </Grid.Col>
      <Grid.Col span={4}>
        Seller
        <div style={{ borderBottom: '1px solid black', width: '90%', height: '70%' }} />
        <span style={{ display: 'flex', justifyContent: 'center', fontSize: '10px' }}>
          Title / Name / Signature
        </span>
      </Grid.Col>
      <Grid.Col span={4}>
        Buyer
        <div style={{ borderBottom: '1px solid black', width: '90%', height: '70%' }} />
        <span style={{ display: 'flex', justifyContent: 'center', fontSize: '10px' }}>
          Title / Name / Signature
        </span>
      </Grid.Col>
    </Grid>
  )
}

export default InvoicesPDF
