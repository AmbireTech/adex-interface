import { Button, Flex, Image, Modal, Text, Textarea, createStyles } from '@mantine/core'
import { Campaign, EventType } from 'adex-common'
import BadgeStatusCampaign from 'components/Dashboard/BadgeStatusCampaign'
import CampaignDetailsRow from 'components/common/CampainDetailsRow'
import FormattedAmount from 'components/common/FormattedAmount/FormattedAmount'
import { formatDateTime } from 'helpers'
import { getMediaUrlWithProvider } from 'helpers/createCampaignHelpers'
import { useAdExApi } from 'hooks/useAdexServices'
import { FormEvent, useState } from 'react'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import RightArrowIcon from 'resources/icons/RightArrow'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useStyles = createStyles((theme) => ({
  header: {
    marginTop: theme.spacing.lg
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.other.fontWeights.bold
  },
  close: {
    color: theme.colors.mainText[theme.fn.primaryShade()]
  }
}))

const AdminCampaignModal = ({
  item,
  opened,
  close
}: {
  item: Campaign | null
  opened: boolean
  close: () => void
}) => {
  const { classes } = useStyles()
  const { adexServicesRequest } = useAdExApi()
  const [reason, setReason] = useState('')
  const [action, setAction] = useState<null | number>(null)
  const [formed, setFormed] = useState(false)
  const [currBanner, setCurrBanner] = useState(0)

  const handleAction = (status: string) => {
    if (!item?.id) return
    setAction(status === 'approve' ? 3 : 4)
    setFormed(true)
  }

  const handleBannerChange = (n: number) => {
    const nextBannerPos = currBanner + n
    const bannerLength = item?.adUnits.length || 0

    if (nextBannerPos < 0) return setCurrBanner(0)
    if (nextBannerPos > bannerLength - 1) return setCurrBanner(bannerLength - 1)
    setCurrBanner(nextBannerPos)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!item?.id) return
    adexServicesRequest('backend', {
      route: `/dsp/admin/campaigns/${item.id}`,
      method: 'PUT',
      body: {
        reviewStatus: action,
        reviewMessage: reason
      },
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(close)
      .catch(console.log)
    setFormed(false)
  }

  return (
    <Modal
      size="lg"
      title="Campaign Overview"
      padding="xl"
      opened={opened}
      onClose={close}
      classNames={{
        header: classes.header,
        title: classes.title,
        close: classes.close
      }}
    >
      {!formed ? (
        <>
          <CampaignDetailsRow title="Title" value={item?.title} />
          <CampaignDetailsRow title="Id" value={item?.id} />
          <CampaignDetailsRow
            title="Status"
            value={<BadgeStatusCampaign type={item?.status as number} />}
          />

          <CampaignDetailsRow title="Served" value={item?.nonce} />
          <CampaignDetailsRow
            lineHeight="sm"
            textSize="sm"
            title="Budget"
            value={
              item && (
                <FormattedAmount
                  chainId={item.outpaceChainId}
                  tokenAddress={item.outpaceAssetAddr}
                  amount={item.campaignBudget}
                  tokenDecimals={item.outpaceAssetDecimals}
                />
              )
            }
          />
          <CampaignDetailsRow
            title="CPM Min"
            value={
              item &&
              item?.pricingBounds[EventType.IMPRESSION]?.min && (
                <FormattedAmount
                  chainId={item.outpaceChainId}
                  tokenAddress={item.outpaceAssetAddr}
                  amount={item.pricingBounds[EventType.IMPRESSION].min}
                  tokenDecimals={item.outpaceAssetDecimals}
                  isCPMAmount
                />
              )
            }
          />
          <CampaignDetailsRow
            title="CPM Max"
            value={
              item &&
              item?.pricingBounds[EventType.IMPRESSION]?.max && (
                <FormattedAmount
                  chainId={item.outpaceChainId}
                  tokenAddress={item.outpaceAssetAddr}
                  amount={item.pricingBounds[EventType.IMPRESSION].max}
                  tokenDecimals={item.outpaceAssetDecimals}
                  isCPMAmount
                />
              )
            }
          />
          {/* TODO: Add data for it */}
          <CampaignDetailsRow
            title="Created"
            value={formatDateTime(new Date(Number(item?.created)))}
          />

          {/* TODO: Add data for it */}
          <CampaignDetailsRow
            title="Starts"
            value={formatDateTime(new Date(Number(item?.activeFrom)))}
          />
          {/* TODO: Add data for it */}
          <CampaignDetailsRow
            title="Ends"
            value={formatDateTime(new Date(Number(item?.activeTo)))}
          />
          {/* TODO: Add data for it */}
          {/* <CampaignDetailsRow title="CPM/CPC min" value="CPM/CPC" /> */}
          {/* TODO: Add data for it */}

          <CampaignDetailsRow
            lineHeight="sm"
            textSize="sm"
            title="Limit average daily spending"
            value={item?.targetingInput.inputs.advanced.limitDailyAverageSpending ? 'Yes' : 'No'}
          />
          {/* TODO: Add data for it */}
          <CampaignDetailsRow
            lineHeight="sm"
            textSize="sm"
            title="Disable frequency capping"
            value={item?.targetingInput.inputs.advanced.disableFrequencyCapping ? 'Yes' : 'No'}
            noBorder
          />
          <CampaignDetailsRow title="Banners:" value={item?.adUnits.length} noBorder />
          {item?.adUnits && item?.adUnits.length > 1 && (
            <Flex justify="space-evenly">
              <LeftArrowIcon onClick={() => handleBannerChange(-1)} />
              {currBanner + 1}
              <RightArrowIcon onClick={() => handleBannerChange(1)} />
            </Flex>
          )}
          <CampaignDetailsRow title="Title:" value={item?.adUnits[currBanner].title} />
          <CampaignDetailsRow
            title="Target URL:"
            value={item?.adUnits[currBanner]?.banner?.targetUrl}
          />
          <CampaignDetailsRow
            title="Created on:"
            value={formatDateTime(new Date(Number(item?.adUnits[currBanner].banner?.created)))}
          />
          <CampaignDetailsRow
            title="Format:"
            value={`h: ${item?.adUnits[currBanner].banner?.format.h}px, w: \n${item?.adUnits[currBanner].banner?.format.w}px`}
          />
          <CampaignDetailsRow
            title="Image:"
            value={
              <Image
                src={getMediaUrlWithProvider(
                  item?.adUnits[currBanner].banner?.mediaUrl,
                  IPFS_GATEWAY
                )}
              />
            }
            column
          />
          <Textarea
            defaultValue={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason..."
          />
          <Flex gap="25px" justify="center" mt="15px">
            <Button onClick={() => handleAction('approve')} color="green">
              Approve
            </Button>
            <Button onClick={() => handleAction('reject')} color="red">
              Reject
            </Button>
          </Flex>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Flex gap="25px" direction="column" justify="center" mt="15px">
            <Text>{action === 3 ? 'Approve' : 'Reject'} reason:</Text>
            <Text>{reason}</Text>
            <Button type="submit">Confirm</Button>
            <Button onClick={() => setFormed(false)} variant="subtle">
              Cancel
            </Button>
          </Flex>
        </form>
      )}
    </Modal>
  )
}

export default AdminCampaignModal
