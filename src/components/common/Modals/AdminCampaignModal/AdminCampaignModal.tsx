import { Button, Flex, Modal, Textarea, createStyles } from '@mantine/core'
import { Campaign } from 'adex-common'
import CampaignDetailsRow from 'components/common/CampainDetailsRow'

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

  const handleAction = (status: number) => {
    if (!item?.id) return
    console.log(status)
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
      <Textarea />
      <Flex gap="25px" justify="center" mt="15px">
        <Button onClick={() => handleAction(3)} color="green">
          Approve
        </Button>
        <Button onClick={() => handleAction(4)} color="red">
          Reject
        </Button>
      </Flex>
    </Modal>
  )
}

export default AdminCampaignModal
