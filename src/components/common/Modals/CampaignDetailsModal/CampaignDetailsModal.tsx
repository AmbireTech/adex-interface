import { Modal, Image, createStyles } from '@mantine/core'
import { Campaign } from 'adex-common'
import Banner from 'resources/banners/banner1.png'
import CampaignDetailsRow from './CampaignDetailsRow'

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

const CampaignDetailsModal = ({
  item,
  opened,
  close
}: {
  item: Campaign | null
  opened: boolean
  close: () => void
}) => {
  const { classes } = useStyles()
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
      <Image src={Banner} pt="xl" pb="xl" />
      <CampaignDetailsRow title="Title" value={item?.title} />
      <CampaignDetailsRow title="Id" value={item?.id} />
      <CampaignDetailsRow title="Status" value={item?.status} />
      <CampaignDetailsRow title="Served" value={item?.nonce} />
      <CampaignDetailsRow title="Budget" value={item?.pricingBounds} />
      {/* TODO: Add data for it */}
      <CampaignDetailsRow title="Created" value={item?.activeFrom} />
      {/* TODO: Add data for it */}
      <CampaignDetailsRow title="Starts" value={item?.activeFrom} />
      {/* TODO: Add data for it */}
      <CampaignDetailsRow title="Ends" value={item?.activeTo} />
      {/* TODO: Add data for it */}
      <CampaignDetailsRow title="CPM/CPC min" value={item?.activeTo} />
      {/* TODO: Add data for it */}
      <CampaignDetailsRow title="Limit average daily spending" value="No" />
      {/* TODO: Add data for it */}
      <CampaignDetailsRow title="Disable frequency capping" value="No" />
    </Modal>
  )
}

export default CampaignDetailsModal
