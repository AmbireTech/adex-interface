import { Button, Flex, Group, Loader, Modal, createStyles } from '@mantine/core'
import InvoicesPDF from 'components/common/CustomTable/InvoicesPDF'
import { ADEX_COMPANY_DETAILS } from 'constants/adexCompanyDetatils'
import useAccount from 'hooks/useAccount'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import useCampaignsData from 'hooks/useCampaignsData'
import { useEffect, useMemo, useState } from 'react'
import { AnalyticsPeriod, BaseAnalyticsData, IInvoiceDetails } from 'types'

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
    adexAccount: {
      billingDetails,
      address,
      fundsOnCampaigns: { perCampaign }
    }
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
  const currencyName = useMemo(
    () =>
      campaign?.id && !!perCampaign.length
        ? perCampaign.find((item) => item.id === campaign?.id)?.token.name || ''
        : '',
    [campaign?.id, perCampaign]
  )
  const campaignMappedAnalytics: BaseAnalyticsData[] | undefined = useMemo(
    () => mappedAnalytics.get(analyticsKey?.key || ''),
    [analyticsKey, mappedAnalytics]
  )

  useEffect(() => {
    if (!campaign) return
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      try {
        const key = await getAnalyticsKeyAndUpdate(campaign, 'hostname')
        setAnalyticsKey(key)
      } catch (e) {
        console.error('Can not get Analytics key: ', e)
      }
    }

    checkAnalytics()
  }, [campaign, getAnalyticsKeyAndUpdate])

  const elements: IInvoiceDetails = useMemo(() => {
    return {
      invoiceId: campaign?.id || '',
      // TODO: Fix the invoice date. use campaign closing date whenever it's added in the
      invoiceDate: new Date(),
      seller: ADEX_COMPANY_DETAILS,
      buyer: {
        ...billingDetails,
        ethAddress: address
      },
      invoiceData:
        campaignMappedAnalytics && campaignMappedAnalytics.length ? campaignMappedAnalytics : [],
      // TODO: Check if the value of VAT% should be greater than 0
      vatPercentageInUSD: 0,
      currencyName
    }
  }, [address, billingDetails, campaign?.id, campaignMappedAnalytics, currencyName])

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
        {!analyticsKey || !campaignMappedAnalytics ? (
          <Flex justify="center" align="center" h="60vh">
            <Loader size="xl" />
          </Flex>
        ) : (
          <>
            <Group position="right">
              <Button mt="md" mb="md" onClick={() => window.print()}>
                Print
              </Button>
            </Group>

            <div className={classes.wrapper}>
              <div id="printable" className={classes.printable}>
                <InvoicesPDF
                  invoiceDetails={elements}
                  placement={campaign?.targetingInput.inputs.placements.in[0] || 'site'}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default PrintModal
