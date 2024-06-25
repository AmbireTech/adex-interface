import { Button, Text } from '@mantine/core'
import CustomPopover from 'components/common/CustomPopover'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

type CreateCampaignBtnProps = {
  hasPopover: boolean
}

const CreateCampaignBtn = ({ hasPopover }: CreateCampaignBtnProps) => {
  const { resetCampaign } = useCreateCampaignContext()
  const navigate = useNavigate()

  const handleBtnClicked = useCallback(() => {
    resetCampaign()
    navigate('/dashboard/create-campaign')
  }, [resetCampaign, navigate])
  return hasPopover ? (
    <CustomPopover
      popoverContent={
        <Text size="sm">
          Contact us on <a href="mailto: dsp@adex.network"> dsp@adex.network</a> to &quot;add
          money&quot; / &quot;launch campaign&quot;
        </Text>
      }
    >
      <Button variant="filled" color="secondaryAccent" size="md">
        New Campaign
      </Button>
    </CustomPopover>
  ) : (
    <Button variant="filled" color="secondaryAccent" size="md" onClick={handleBtnClicked}>
      New Campaign
    </Button>
  )
}

export default CreateCampaignBtn
