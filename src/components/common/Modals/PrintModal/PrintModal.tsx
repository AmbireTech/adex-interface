import { Button, Group, Modal, createStyles } from '@mantine/core'
// import { useDisclosure } from '@mantine/hooks'
import InvoicesPDF from 'components/common/CustomTable/InvoicesPDF'
import useAccount from 'hooks/useAccount'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import useCampaignsData from 'hooks/useCampaignsData'
import { useEffect, useMemo, useState } from 'react'
import { AnalyticsPeriod, BaseAnalyticsData, IInvoiceData, IInvoiceDetails } from 'types'

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: '1px solid',
    borderRadius: theme.radius.sm,
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    padding: theme.spacing.lg
  },
  header: {
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    padding: theme.spacing.xl
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.other.fontWeights.bold
  },
  close: {
    color: theme.colors.mainText[theme.fn.primaryShade()]
  },
  printable: {
    [theme.other.media.print]: {
      // NOTE: it's not fixed/absolute to body but modal.inner
      overflow: 'visible',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '100%',
      padding: theme.spacing.xl
    }
  }
}))

type PrintModalProps = {
  campaignId: string
  opened: boolean
  close: () => void
}

const PrintModal = ({ campaignId, opened, close }: PrintModalProps) => {
  const { campaignsData } = useCampaignsData()
  const {
    adexAccount: { billingDetails, address }
  } = useAccount()
  const { getAnalyticsKeyAndUpdate, mappedAnalytics } = useCampaignAnalytics()
  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
        period: AnalyticsPeriod
      }
    | undefined
  >()

  const campaignData = useMemo(
    () => campaignsData.get(campaignId),

    [campaignId, campaignsData]
  )

  const campaign = useMemo(() => campaignData?.campaign, [campaignData])
  const campaignMappedAnalytics: BaseAnalyticsData[] | undefined = useMemo(
    () => mappedAnalytics.get(analyticsKey?.key || ''),
    [analyticsKey, mappedAnalytics]
  )

  useEffect(() => {
    if (!campaign) return
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate(campaign, 'hostname')
      setAnalyticsKey(key)
    }

    checkAnalytics()
  }, [campaign, getAnalyticsKeyAndUpdate])

  console.log('campaignMappedAnalytics', campaignMappedAnalytics)

  const elements: IInvoiceDetails = useMemo(() => {
    return {
      invoiceId: campaign?.id || '',
      // TODO: Fix the invoice date
      invoiceDate: Date.now().toString(),
      seller: {
        name: billingDetails.companyName,
        address: billingDetails.companyAddress,
        city: billingDetails.companyCity,
        country: billingDetails.companyCountry,
        regNumber: billingDetails.companyNumber,
        vatRegNumber: billingDetails.companyNumberPrim,
        ethAddress: address
      },
      buyer: {
        name: 'AdEx Network',
        address: 'address line 2',
        city: 'City 2',
        country: 'Country 2',
        regNumber: '304503203',
        vatRegNumber: 'LT100011416217',
        ethAddress: '0x2F0FC72542A8bD8ds1c51B2751686A3Bf3eks42w'
      },
      invoiceData:
        campaignMappedAnalytics && campaignMappedAnalytics.length
          ? campaignMappedAnalytics.map(
              (element) =>
                ({
                  description: element.segment,
                  unitOfMeasure: 'impressions',
                  quantity: element.impressions,
                  priceInUsd: element.ctr,
                  amountInUsd: element.paid
                } as IInvoiceData)
            )
          : [],
      vatPercentageInUSD: 0
    }
  }, [])

  const { classes } = useStyles()
  return (
    <Modal
      title="Invoice"
      size="xl"
      opened={opened}
      onClose={close}
      centered
      radius="sm"
      classNames={{
        header: classes.header,
        title: classes.title,
        close: classes.close
      }}
    >
      <div>
        <Group position="right">
          <Button mt="md" mb="md" onClick={() => window.print()}>
            Print
          </Button>
        </Group>
        <div className={classes.wrapper}>
          <div id="printable" className={classes.printable}>
            {/* TODO: Remove InvoicesPDF */}
            <InvoicesPDF invoiceDetails={elements} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PrintModal
