import { Button, Group, Stack, Text } from '@mantine/core'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import CampaignDetailsRow from 'components/common/CampainDetailsRow'
import { UtmInfo } from './CreateCampaignCommon'

const CampaignSummary = () => {
  const {
    campaign: {
      autoUTMChecked,
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          }
        }
      }
    },
    saveToDraftCampaign,
    step,
    nextStep,
    prevStep
  } = useCreateCampaignContext()
  const {
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    adFormats,
    campaignBudgetFormatted,
    advancedTargeInput
  } = useCreateCampaignData()

  return (
    <>
      <Stack gap="xs">
        <CampaignDetailsRow
          lighterColor
          title="Budget"
          value={campaignBudgetFormatted}
          textSize="sm"
        />
        <CampaignDetailsRow lighterColor title="CPM" value={priceBoundsFormatted} textSize="sm" />
        <CampaignDetailsRow
          lighterColor
          title="Placement"
          value={placement === 'site' ? 'Website' : 'App'}
          textSize="sm"
        />
        {placement === 'site' && (
          <CampaignDetailsRow
            lighterColor
            title="Device"
            textSize="sm"
            value={formattedSelectedDevice}
          />
        )}
        <CampaignDetailsRow lighterColor title="Ad Format" value={adFormats} textSize="sm" />
        <CampaignDetailsRow lighterColor title="Categories" value={formattedCats} textSize="sm" />
        <CampaignDetailsRow lighterColor title="Countries" value={formattedLocs} textSize="sm" />
        <CampaignDetailsRow
          lighterColor
          title="Limit average daily spending"
          value={advancedTargeInput.limitDailyAverageSpending ? 'Yes' : 'No'}
          textSize="sm"
          mb="xs"
        />

        <CampaignDetailsRow
          lighterColor
          title="Auto UTM tracking"
          value={
            <Group gap="sm">
              <Text size="inherit" c={autoUTMChecked ? 'success' : 'warning'}>
                {autoUTMChecked ? 'Enabled' : 'Disabled'}
              </Text>
              <UtmInfo title="" placement={placement} />
            </Group>
          }
          textSize="sm"
          noBorder
          mb="xs"
        />
      </Stack>
      {/* Temporary disabled */}
      {/* <Flex justify="space-between" className={classes.bg} p="lg">
        <Text c="secondaryText" fw="bold">
          Estimated Daily Impressions
        </Text>
        <Text c="secondaryText">0</Text>
      </Flex> */}
      <Stack align="stretch" justify="space-between" gap="sm" mt="xl" px="md">
        {step === CREATE_CAMPAIGN_STEPS ? (
          <Button type="submit" size="lg" variant="filled">
            Launch Campaign
          </Button>
        ) : (
          <Button size="lg" variant="filled" onClick={nextStep}>
            Next Step
          </Button>
        )}

        <Button size="lg" variant="outline" onClick={saveToDraftCampaign}>
          Save Draft
        </Button>
        {step > 0 && (
          <Button
            variant="transparent"
            color="brand"
            onClick={prevStep}
            leftSection={<LeftArrowIcon size="14px" />}
          >
            Go Back
          </Button>
        )}
      </Stack>
    </>
  )
}
export default CampaignSummary
