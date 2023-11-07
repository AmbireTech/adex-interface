import { Grid, createStyles, Text } from '@mantine/core'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCustomStepper from 'hooks/useCustomStepper'
import useSelectedTab from 'hooks/useSelectedTab'
import useDropzone from 'hooks/useDropzone'
import { Banners, FileWithPath } from 'types'
import { useCallback, useState } from 'react'
import { BANNER_VARIANTS } from 'constants/banners'
import CustomStepper from './CampaignStepper'
import BannerSizesList from './BannerSizesList'
import CampaignSummary from './CampaignSummary'
import SelectDevice from './SelectDevice'
import FilesDropzone from './FilesDropzone'
import UploadedBanners from './UploadedBanners'

const useStyles = createStyles((theme) => {
  return {
    // TODO: Think about the idea to add the common container styles in the theme
    container: {
      backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.xs
      // padding: theme.spacing.lg
    },
    lightGray: {
      color: theme.fn.lighten(
        theme.colors.secondaryText[theme.fn.primaryShade()],
        theme.other.shades.lighten.lighter
      )
    },
    dropZone: {
      backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
      border: '1px solid',
      borderRadius: theme.radius.sm,
      borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
      height: 112
    },
    decorativeBorder: {
      width: '99%',
      height: '99%',
      border: '1px dashed',
      borderRadius: theme.radius.sm
    }
  }
})

const CreateCampaign = () => {
  const { classes } = useStyles()

  const [autoUTMChecked, setAutoUTMChecked] = useState(false)
  const updateAutoUTMChecked = useCallback((isChecked: boolean) => setAutoUTMChecked(isChecked), [])
  const { activeStep, nextStep, previousStep } = useCustomStepper({
    stepsCount: CREATE_CAMPAIGN_STEPS
  })
  const { selectedTab, selectTab } = useSelectedTab(null)

  const [imagesInfo, setImagesInfo] = useState<Banners>({
    mediumRectangle: { details: BANNER_VARIANTS.mediumRectangle, fileDetails: [] },
    skyscraper: { details: BANNER_VARIANTS.skyscraper, fileDetails: [] },
    leaderboard: { details: BANNER_VARIANTS.leaderboard, fileDetails: [] },
    billboard: { details: BANNER_VARIANTS.billboard, fileDetails: [] },
    halfPage: { details: BANNER_VARIANTS.halfPage, fileDetails: [] },
    mobileBanner: { details: BANNER_VARIANTS.mobileBanner, fileDetails: [] },
    mobileLeaderboard: { details: BANNER_VARIANTS.mobileLeaderboard, fileDetails: [] },
    others: { fileDetails: [] }
  })

  const updateBanners = useCallback(
    (updatedValues: Banners) => setImagesInfo((prev) => ({ ...prev, ...updatedValues })),
    []
  )

  const { onDrop, updateUploadedFiles, uploadedFiles } = useDropzone({ updateBanners })

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: FileWithPath) => {
      if (!uploadedFiles) return
      updateUploadedFiles(uploadedFiles.filter((item) => item.name !== file.name))
    },
    [uploadedFiles, updateUploadedFiles]
  )
  return (
    <Grid mr="xl" ml="xl" mt="md">
      <Grid.Col span={8} className={classes.container} p="lg">
        <Grid p="md">
          <Grid.Col>
            <CustomStepper active={activeStep} stepsCount={CREATE_CAMPAIGN_STEPS} />
          </Grid.Col>
          <Grid.Col>
            <Text color="secondaryText" size="sm" weight="bold" mb="xs">
              1. Select device
            </Text>
            <SelectDevice selectedTab={selectedTab} selectTab={selectTab} />
          </Grid.Col>
          <Grid.Col>
            {selectedTab && (
              <>
                <Text color="secondaryText" size="sm" weight="bold" mb="xs">
                  2. Upload creatives
                </Text>
                <Text color="secondaryText" size="xs" weight="bold" mb="xs">
                  Accepted banner sizes
                </Text>
                <BannerSizesList selectedTab={selectedTab} imagesInfo={imagesInfo} />
                <FilesDropzone onDrop={onDrop} />
              </>
            )}
          </Grid.Col>
          <Grid.Col>
            <UploadedBanners
              autoUTMChecked={autoUTMChecked}
              uploadedFiles={uploadedFiles}
              updateAutoUTMChecked={updateAutoUTMChecked}
              imagesInfo={imagesInfo}
              handleDeleteCreativeBtnClicked={handleDeleteCreativeBtnClicked}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col
        span={3}
        offset={1}
        className={classes.container}
        style={{ height: 689, padding: 0 }}
      >
        <CampaignSummary onNextStep={nextStep} onBack={previousStep} />
      </Grid.Col>
    </Grid>
  )
}

export default CreateCampaign
