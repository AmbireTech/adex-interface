import { Button, Flex, Group, Text, UnstyledButton, createStyles } from '@mantine/core'
import CampaignDetailsRow from 'components/common/Modals/CampaignDetailsModal/CampaignDetailsRow'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import DesktopIcon from 'resources/icons/Desktop'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import MobileIcon from 'resources/icons/Mobile'

const useStyles = createStyles((theme) => ({
  bg: {
    background:
      theme.colors.warning[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest
  },
  icon: {
    width: 14,
    height: 14
  },
  lightestBrandColor: {
    color: theme.colors.brand[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lighter
  }
}))

const CampaignSummary = () => {
  const { classes } = useStyles()
  const {
    campaign: { device, step },
    updateCampaign
  } = useCreateCampaignContext()

  return (
    <>
      <Flex direction="column" p="md">
        <CampaignDetailsRow lighterColor title="Budget" value="-" />
        <CampaignDetailsRow lighterColor title="CPM" value="-" />
        <CampaignDetailsRow
          lighterColor
          title="Device"
          value={
            device && device === 'desktop' ? (
              <Flex align="center" gap={5}>
                <DesktopIcon size="16px" /> Desktop
              </Flex>
            ) : (
              <Flex align="center" gap={5}>
                <MobileIcon size="16px" /> Mobile
              </Flex>
            )
          }
        />
        <CampaignDetailsRow lighterColor title="Ad Format" value="-" />
        <CampaignDetailsRow lighterColor title="Categories" value="-" />
        <CampaignDetailsRow lighterColor title="Countries" value="-" />
      </Flex>
      <Flex justify="space-between" className={classes.bg} p="lg">
        <Text color="secondaryText" weight="bold">
          Estimated Daily Impressions
        </Text>
        <Text color="secondaryText">0</Text>
      </Flex>
      <Flex direction="column" justify="space-between" align="center">
        <Button
          w="90%"
          size="lg"
          mt="md"
          variant="filled"
          onClick={() => step < CREATE_CAMPAIGN_STEPS && updateCampaign('step', step + 1)}
        >
          Next Step
        </Button>
        <Button w="90%" size="lg" mt="md" variant="outline">
          Save Draft
        </Button>
        <UnstyledButton variant="underlined" mt="sm">
          <Group
            position="center"
            onClick={() => step > 0 && updateCampaign('step', step - 1)}
            align="center"
            spacing="xs"
            h={50}
          >
            <span className={classes.lightestBrandColor}>
              <LeftArrowIcon className={classes.icon} />
            </span>
            <Text size="lg" weight="bold" underline className={classes.lightestBrandColor}>
              Go Back
            </Text>
          </Group>
        </UnstyledButton>
      </Flex>
    </>
  )
}

export default CampaignSummary
