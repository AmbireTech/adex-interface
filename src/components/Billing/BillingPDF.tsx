import { Space, Table, Text, Box, Group, Stack, Title, Divider } from '@mantine/core'
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

const BillingBlank = ({ children, header, seller, buyer, title }: DetailsProps) => {
  return (
    <Stack fz="sm" p="xs" m={0} gap="lg">
      <Group justify="space-between" align="center">
        <Box w={160}>
          <AdExLogo />
        </Box>
        <Title order={2} fw="bold">
          {title}
        </Title>
      </Group>

      <Stack>
        <Group grow align="top">
          <Stack>
            <Stack gap="0">
              <span>{`${title} to:`} </span>
              <span>{buyer.companyName}</span>
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

          <Box>{header}</Box>
        </Group>

        <Space h="md" />
        {children}
        <Space h="lg" />
        <Divider />
        <Stack>
          <Group grow align="baseline">
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

            <Stack ta="right" gap="0">
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
  const calculatedVatValue = invoiceDetails.amount * (invoiceDetails.vatPercentageInUSD / 100)
  const invoiceTotal = invoiceDetails.amount + calculatedVatValue
  return (
    <BillingBlank
      title="Invoice"
      seller={invoiceDetails.seller}
      buyer={invoiceDetails.buyer}
      header={
        <Stack gap="0">
          <Group justify="space-between" align="baseline" wrap="nowrap">
            <Text c="secondaryText" ta="left">
              Invoice:
            </Text>
            <Text size="xs" fw="bold" style={{ wordBreak: 'break-word' }}>
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
        <Table fs="xs" verticalSpacing="xs" w="100%" withColumnBorders withTableBorder>
          <Table.Thead bg="alternativeBackground" tt="capitalize">
            <Table.Tr>
              <Table.Th>Placement</Table.Th>
              <Table.Th ta="right">Impressions</Table.Th>
              <Table.Th ta="right">Clicks</Table.Th>
              <Table.Th ta="right">CTR %</Table.Th>
              <Table.Th ta="right">
                <span>Average CPM</span>
                <br />
                <span>({invoiceDetails.currencyName})</span>
              </Table.Th>
              <Table.Th ta="right">
                <span>Spent</span>
                <br />
                <span>({invoiceDetails.currencyName})</span>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody bg="lightBackground">
            <Table.Tr>
              <Table.Td>{placement}</Table.Td>
              <Table.Td ta="right">{invoiceDetails.impressions.toLocaleString()}</Table.Td>
              <Table.Td ta="right">{invoiceDetails.clicks.toLocaleString()}</Table.Td>
              <Table.Td ta="right">{invoiceDetails.ctr}</Table.Td>
              <Table.Td ta="right">{invoiceDetails.avgCpm}</Table.Td>
              <Table.Td ta="right">{invoiceDetails.amount.toFixed(4)}</Table.Td>
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
  return (
    <BillingBlank
      title="Statement"
      seller={seller}
      buyer={buyer}
      header={
        <Stack gap="0">
          <Group justify="space-between">
            <Text c="secondaryText">Statement Period:</Text>
            <Text fw="bold">
              {getMonthRangeString(monthPeriodIndexToDate(statement.periodIndex))}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text c="secondaryText">Currency / Token:</Text>
            <Text c="secondaryText">
              {statement.token.name} (chain: {networks[statement.token.chainId]})
            </Text>
          </Group>

          <Group justify="space-between" mt="lg">
            <Text c="secondaryText">Start balance:</Text>
            <Text c="secondaryText" fw="bold">
              {formatTokenAmount(statement.startBalance, statement.token)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text c="secondaryText">End balance:</Text>
            <Text c="secondaryText" fw="bold">
              {formatTokenAmount(statement.endBalance, statement.token)}
            </Text>
          </Group>
        </Stack>
      }
    >
      <>
        <Table fs="xs" verticalSpacing="xs" w="100%" withColumnBorders withTableBorder>
          <Table.Thead bg="alternativeBackground" tt="capitalize">
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th ta="right">Amount ({statement.token.name})</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody bg="lightBackground">
            {statement.operations.map((e, index) => (
              // eslint-disable-next-line
              <Table.Tr key={index}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{e.date.toLocaleDateString()}</Table.Td>
                <Table.Td>
                  <Text tt="capitalize">{e.name}</Text>
                </Table.Td>
                <Table.Td style={{ wordBreak: 'break-word' }}>{e.id}</Table.Td>
                <Table.Td ta="right">
                  {`${e.type === 'campaignOpen' ? '-' : '+'}   ${formatTokenAmount(
                    e.amount,
                    statement.token
                  )}`}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Divider />
        <Stack gap="xs">
          <Text fz="xs" inline>
            This is not a bill.
          </Text>
          <Text fz="xs" inline>
            This is a summary of account activity for the time period stated above
          </Text>
        </Stack>
      </>
    </BillingBlank>
  )
}
