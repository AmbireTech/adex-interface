import { Button, Flex, Modal, Text, Textarea, createStyles } from '@mantine/core'
import { Campaign } from 'adex-common'
import CampaignDetailsRow from 'components/common/CampainDetailsRow'
import { useAdExApi } from 'hooks/useAdexServices'
import { FormEvent, useState } from 'react'

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

  const handleAction = (status: string) => {
    if (!item?.id) return
    setAction(status === 'approve' ? 3 : 4)
    setFormed(true)
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
          {}
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
