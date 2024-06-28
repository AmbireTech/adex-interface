import { Button } from '@mantine/core'
import TopUpAccountModal from 'components/common/TopUpAccountModal'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type CreateCampaignBtnProps = {
  hasPopover: boolean
}

const CreateCampaignBtn = ({ hasPopover }: CreateCampaignBtnProps) => {
  const { resetCampaign } = useCreateCampaignContext()
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)
  const handleModalClicked = useCallback(() => setOpened((prev) => !prev), [])
  const handleBtnClicked = useCallback(() => {
    if (hasPopover) {
      handleModalClicked()
    } else {
      resetCampaign()
      navigate('/dashboard/create-campaign')
    }
  }, [hasPopover, handleModalClicked, resetCampaign, navigate])
  return (
    <>
      <Button variant="filled" color="secondaryAccent" size="md" onClick={handleBtnClicked}>
        New Campaign
      </Button>
      <TopUpAccountModal
        onCancelClicked={handleModalClicked}
        onConfirmClicked={handleModalClicked}
        opened={opened}
      />
    </>
  )
}

export default CreateCampaignBtn
