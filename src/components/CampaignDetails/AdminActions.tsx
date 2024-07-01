import { Button, Flex, Text, Textarea } from '@mantine/core'
import { Campaign } from 'adex-common'

import { useAdExApi } from 'hooks/useAdexServices'
import { FormEvent, useState } from 'react'

export const AdminActions = ({ item }: { item: Campaign | null }) => {
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
    }).catch(console.log)
    setFormed(false)
  }

  return (
    <Flex>
      {!formed ? (
        <>
          <Textarea
            label="Required"
            required
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
    </Flex>
  )
}
