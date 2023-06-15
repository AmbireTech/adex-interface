import { Grid, Space, Table, createStyles } from '@mantine/core'
import { invoiceDetails } from 'components/Billing/Invoices/mockedData'

const useStyles = createStyles((theme) => ({
  wrapper: {
    color: theme.colors.secondaryText[theme.fn.primaryShade()],
    span: {
      display: 'block',
      wordBreak: 'break-word'
    }
  },
  title: {
    fontSize: theme.fontSizes.xl,
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
    color: theme.black
  },
  italic: {
    fontStyle: 'italic'
  }
}))

const InvoicesPDF = () => {
  const { classes, cx } = useStyles()

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-us', {
      day: 'numeric',
      year: 'numeric',
      month: 'long'
    })

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
          <span className={classes.bold}>{invoiceDetails.seller.name}</span>
          <span>{invoiceDetails.seller.address}</span>
          <span>{invoiceDetails.seller.city}</span>
          <span>{invoiceDetails.seller.country}</span>
        </div>
        <Space h="xl" />
        <div className={classes.wrapper}>
          <span>Reg. No.: {invoiceDetails.seller.regNumber}</span>
          <span>VAT Reg. No.: {invoiceDetails.seller.vatRegNumber}</span>
          <span>ETH Address: {invoiceDetails.seller.ethAddress}</span>
        </div>
      </Grid.Col>
      <Grid.Col span={6}>
        <div className={classes.wrapper}>
          <span className={classes.italic}>Buyer</span>
          <span className={classes.bold}>{invoiceDetails.buyer.name}</span>
          <span>{invoiceDetails.buyer.address}</span>
          <span>{invoiceDetails.buyer.city}</span>
          <span>{invoiceDetails.buyer.country}</span>
        </div>
        <Space h="xl" />
        <div className={classes.wrapper}>
          <span>Reg. No.: {invoiceDetails.buyer.regNumber}</span>
          <span>VAT Reg. No.: {invoiceDetails.buyer.vatRegNumber}</span>
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
              <th>Description</th>
              <th>Unit of Measure</th>
              <th>Quantity</th>
              <th>Price, USD</th>
              <th>Amount, USD</th>
            </tr>
          </thead>
          <tbody>
            {invoiceDetails.invoiceData.map((e, index) => (
              // eslint-disable-next-line
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{e.description}</td>
                <td>{e.unitOfMeasure}</td>
                <td>{e.quantity}</td>
                <td>{e.priceInUsd}</td>
                <td>{e.amountInUsd}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={9} className={cx(classes.right, classes.bold)}>
        Total Exl. VAT, USD
      </Grid.Col>
      <Grid.Col span={2} className={cx(classes.right, classes.bold)}>
        3490.00
      </Grid.Col>
      <Grid.Col span={9} className={cx(classes.right, classes.bold)}>
        VAT 0%, USD
      </Grid.Col>
      <Grid.Col span={2} className={cx(classes.right, classes.bold)}>
        0.00
      </Grid.Col>
      <Grid.Col span={9} className={cx(classes.right, classes.bold)}>
        Total Incl. VAT, USD
      </Grid.Col>
      <Grid.Col span={2} className={cx(classes.right, classes.bold)}>
        3490.00
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
