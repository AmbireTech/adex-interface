import { FormEvent, useCallback, useState, useMemo } from 'react'
import { Button, Flex, Text, Textarea, Badge } from '@mantine/core'
import { Campaign, CampaignStatus, ReviewStatus } from 'adex-common'
import throttle from 'lodash.throttle'
import { useAdExApi } from 'hooks/useAdexServices'
import { useCampaignsData } from 'hooks/useCampaignsData'
import useCustomNotifications from 'hooks/useCustomNotifications'

export const AdminActions = ({ item }: { item: Campaign | null }) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()
  const { updateCampaignDataById } = useCampaignsData()
  const [reason, setReason] = useState(item?.reviewMessage || '')
  const [action, setAction] = useState<null | number>(null)
  const [formed, setFormed] = useState(false)

  const reviewed = useMemo(() => item?.status !== CampaignStatus.inReview, [item?.status])

  const handleAction = (status: string) => {
    if (!item?.id) return
    setAction(status === 'approve' ? 3 : 4)
    setFormed(true)
  }

  const handleSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault()
      if (!item?.id) return

      try {
        await adexServicesRequest('backend', {
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
        showNotification('info', `Campaign ${item.id} status update success!`)
        await updateCampaignDataById(item.id)
      } catch (err) {
        console.log(err)
      }
      setFormed(false)
    },
    [action, adexServicesRequest, item?.id, reason, showNotification, updateCampaignDataById]
  )

  const throttledSbm = useMemo(
    () => throttle(handleSubmit, 1000, { leading: true }),
    [handleSubmit]
  )

  if (reviewed) {
    return (
      <Flex direction="column" justify="flex-start" align="stretch">
        {item?.reviewStatus !== undefined && (
          <Badge size="xl" mb="md" fullWidth>
            {ReviewStatus[item.reviewStatus]}
          </Badge>
        )}
        <Text color="secondaryText">Review msg:</Text>
        <Text>{reason}</Text>
      </Flex>
    )
  }

  return (
    <Flex direction="column" justify="flex-start" align="stretch">
      {item?.reviewStatus !== undefined && (
        <Badge size="xl" mb="md" fullWidth>
          {ReviewStatus[item.reviewStatus]}
        </Badge>
      )}
      {!formed ? (
        <>
          <Textarea
            label="Required"
            required
            defaultValue={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason..."
          />
          <Flex gap="25px" justify="flex-start" mt="15px">
            <Button onClick={() => handleAction('approve')} color="green">
              Approve
            </Button>

            <Button onClick={() => handleAction('reject')} color="red">
              Reject
            </Button>
          </Flex>
        </>
      ) : (
        <form onSubmit={throttledSbm}>
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
    </Flex>
  )
}
