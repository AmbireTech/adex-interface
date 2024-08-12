import { useCallback, useMemo } from 'react'
import { Checkbox, Grid, Text, Code, HoverCard, ThemeIcon, Badge } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit } from 'adex-common/dist/types'
import { UploadedBannersProps } from 'types'
import InfoIcon from 'resources/icons/Info'
import ImageUrlInput from './ImageUrlInput'

const UploadedBanners = ({
  updateAutoUTMChecked,
  autoUTMChecked,
  onDeleteCreativeBtnClicked,
  handleOnInputChange
}: UploadedBannersProps) => {
  const {
    campaign: {
      adUnits,
      errorsTargetURLValidations,
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          }
        }
      }
    },
    selectedBannerSizes,

    validateAdUnitTargetURL
  } = useCreateCampaignContext()

  const allowedSizes = useMemo(
    () => selectedBannerSizes.flat().map((item) => item.value),
    [selectedBannerSizes]
  )

  const isMatchedTheSizes = useCallback(
    (img: AdUnit) => {
      if (!allowedSizes || allowedSizes.length === 0) {
        return true
      }

      const size = `${img.banner?.format.w}x${img.banner?.format.h}`
      return allowedSizes.includes(size)
    },
    [allowedSizes]
  )

  return (
    <Grid>
      <Grid.Col>
        <Checkbox
          checked={autoUTMChecked}
          // label="Auto UTM tracking"
          label={
            <HoverCard width={420}>
              <HoverCard.Target>
                <Badge
                  variant="transparent"
                  c="mainText"
                  rightSection={
                    <ThemeIcon size="xs" variant="transparent">
                      <InfoIcon size="inherit" />
                    </ThemeIcon>
                  }
                >
                  Auto UTM tracking *
                </Badge>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="md">
                  * if checked all manually added UTM tags will be overridden by auto tags in
                  format:{' '}
                  <Code>
                    {`utm_source=AdEx&utm_term=${
                      placement === 'site' ? 'Website' : 'App'
                    }&utm_campaign={CAMPAIGN_TITLE}&utm_content={BANNER_SIZE}`}
                  </Code>
                  {'. '}
                  On impression will be added
                  <Code>{`&utm_medium={${
                    placement === 'site' ? 'WEBSITE_DOMAIN' : 'APP_NAME'
                  }}`}</Code>
                </Text>
              </HoverCard.Dropdown>
            </HoverCard>
          }
          onChange={(event) => updateAutoUTMChecked(event.currentTarget.checked)}
        />
      </Grid.Col>
      {adUnits.length > 0 &&
        adUnits.map((image: AdUnit) => {
          return (
            <Grid.Col key={image.id}>
              <ImageUrlInput
                image={image}
                error={errorsTargetURLValidations[image.id] || undefined}
                toRemove={!isMatchedTheSizes(image)}
                onDelete={onDeleteCreativeBtnClicked}
                onChange={(e: any) => handleOnInputChange(e.target.value, image.id)}
                onBlur={() => validateAdUnitTargetURL()}
              />
            </Grid.Col>
          )
        })}
    </Grid>
  )
}

export default UploadedBanners
