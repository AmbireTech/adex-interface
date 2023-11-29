import { Container, Flex, createStyles } from '@mantine/core'
import CampaignDetailsRow from 'components/common/Modals/CampaignDetailsModal/CampaignDetailsRow'
import { checkSelectedDevices } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    border: '1px solid',
    borderRadius: theme.radius.md,
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    maxWidth: '100%'
  }
}))

const StepFour = () => {
  const { classes } = useStyles()
  const {
    campaign: { devices }
  } = useCreateCampaignContext()
  const selectedDevices = useMemo(() => checkSelectedDevices(devices), [devices])

  return (
    <Container className={classes.wrapper}>
      <CampaignDetailsRow lighterColor title="1. Campaign Name" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="2. Campaign Budget" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="3. CPM" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="4. Campaign Period" value="-" textSize="sm" />
      <CampaignDetailsRow
        lighterColor
        title="5. Device Type"
        value={
          selectedDevices === 'desktop' ? (
            <Flex align="center" gap={5}>
              <DesktopIcon size="16px" /> Desktop
            </Flex>
          ) : selectedDevices === 'mobile' ? (
            <Flex align="center" gap={5}>
              <MobileIcon size="16px" /> Mobile
            </Flex>
          ) : selectedDevices === 'both' ? (
            <Flex align="center" gap={5}>
              <MobileIcon size="16px" /> Mobile
              <DesktopIcon size="16px" /> Desktop
            </Flex>
          ) : null
        }
        textSize="sm"
      />
      <CampaignDetailsRow lighterColor title="6. Ad Format" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="7. Creatives" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="8. Selected Categories" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="9. Selected Countries" value="-" noBorder />
    </Container>
  )
}

export default StepFour
