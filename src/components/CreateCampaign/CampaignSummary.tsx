import { useMemo } from 'react'
import { Button, Group, Stack, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import DetailsRow from 'components/common/DetailsRow'
import { UtmInfo } from './CreateCampaignCommon'

const CampaignSummary = ({ onLaunchClick }: { onLaunchClick: () => void }) => {
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
    prevStep,
    allowedBannerSizes
  } = useCreateCampaignContext()
  const {
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    adFormats,
    campaignBudgetFormatted,
    advancedTargeInput,
    estimatedImpressions
  } = useCreateCampaignData()

  const loading = useMemo(() => !allowedBannerSizes.length, [allowedBannerSizes.length])

  return (
    <Stack gap="xs">
      <DetailsRow lighterColor title="Budget" value={campaignBudgetFormatted} textSize="sm" />
      <DetailsRow lighterColor title="CPM" value={priceBoundsFormatted} textSize="sm" />
      <DetailsRow
        lighterColor
        title="Placement"
        value={placement === 'site' ? 'Website' : 'App'}
        textSize="sm"
      />
      {placement === 'site' && (
        <DetailsRow lighterColor title="Device" textSize="sm" value={formattedSelectedDevice} />
      )}
      <DetailsRow lighterColor title="Ad Format" value={adFormats} textSize="sm" />
      <DetailsRow lighterColor title="Categories" value={formattedCats} textSize="sm" />
      <DetailsRow lighterColor title="Countries" value={formattedLocs} textSize="sm" />
      <DetailsRow
        lighterColor
        title="Limit average daily spending"
        value={advancedTargeInput.limitDailyAverageSpending ? 'Yes' : 'No'}
        textSize="sm"
      />
      <DetailsRow
        lighterColor
        title="Aggressive bidding"
        value={advancedTargeInput.aggressiveBidding ? 'Yes' : 'No'}
        textSize="sm"
      />

      <DetailsRow
        lighterColor
        title="Loose source bidding"
        value={advancedTargeInput.looseSourceCTR ? 'Yes' : 'No'}
        textSize="sm"
      />

      <DetailsRow
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
      <DetailsRow title="Estimated Impressions" value={estimatedImpressions} textSize="sm" />
      <Stack align="stretch" justify="space-between" gap="sm" mt="xl" px="md">
        {step === 3 ? (
          <Button onClick={onLaunchClick} size="lg" variant="filled">
            Launch Campaign
          </Button>
        ) : (
          <Button size="lg" variant="filled" onClick={nextStep} loading={loading}>
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
    </Stack>
  )
}
export default CampaignSummary
