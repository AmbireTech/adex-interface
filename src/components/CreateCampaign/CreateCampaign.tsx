import { useCallback, useEffect, useState } from 'react'
import { Grid, Group, createStyles, Text, Checkbox } from '@mantine/core'
import { BannerVariant, Banners, FileWithPath, ShapeVariants } from 'types'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import ImageIcon from 'resources/icons/Image'
import HtmlIcon from 'resources/icons/Html'
import { BANNER_VARIANTS } from 'constants/banners'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCustomStepper from 'hooks/useCustomStepper'
import useSelectedTab from 'hooks/useSelectedTab'
import CustomStepper from './CampaignStepper'
import BannerSizesList from './BannerSizesList'
import ImageUrlInput from './ImageUrlInput'
import CampaignSummary from './CampaignSummary'
import SelectDevice from './SelectDevice'

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

  const { activeStep, nextStep, previousStep } = useCustomStepper({
    stepsCount: CREATE_CAMPAIGN_STEPS
  })
  const { selectedTab, selectTab } = useSelectedTab(null)

  // Upload Files
  const [autoUTMChecked, setAutoUTMChecked] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[] | null>(null)

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

  const onDrop = useCallback((files: FileWithPath[] | null) => {
    if (files === null) return
    setUploadedFiles(files)
  }, [])
  const getBanners = useCallback(
    (files: FileWithPath[]) => {
      const bannersDefaultValue: Banners = {
        mediumRectangle: { details: BANNER_VARIANTS.mediumRectangle, fileDetails: [] },
        skyscraper: { details: BANNER_VARIANTS.skyscraper, fileDetails: [] },
        leaderboard: { details: BANNER_VARIANTS.leaderboard, fileDetails: [] },
        billboard: { details: BANNER_VARIANTS.billboard, fileDetails: [] },
        halfPage: { details: BANNER_VARIANTS.halfPage, fileDetails: [] },
        mobileBanner: { details: BANNER_VARIANTS.mobileBanner, fileDetails: [] },
        mobileLeaderboard: { details: BANNER_VARIANTS.mobileLeaderboard, fileDetails: [] },
        others: { fileDetails: [] }
      }

      if (files.length === 0) {
        updateBanners(bannersDefaultValue)
        return
      }

      const variantKeys = Object.keys(BANNER_VARIANTS)

      files &&
        files.forEach((file: FileWithPath) => {
          const reader = new FileReader()
          let matchedVariant: BannerVariant | null = null
          reader.onload = (e: any) => {
            const img = new Image()
            img.src = e.target.result

            img.onload = () => {
              const width = img.width
              const height = img.height

              for (let i = 0; i < variantKeys.length; i += 1) {
                const variant = BANNER_VARIANTS[variantKeys[i]]
                matchedVariant = variant
                if (variant.bannerSizes === `${width}x${height}`) {
                  matchedVariant.checked = true
                  bannersDefaultValue[matchedVariant!.label]!.fileDetails.push(file)
                  break
                }
              }
              if (!matchedVariant?.checked) bannersDefaultValue.others.fileDetails.push(file)

              updateBanners(bannersDefaultValue)
            }
          }
          reader.readAsDataURL(file)
        })
    },
    [updateBanners]
  )

  useEffect(() => {
    getBanners(uploadedFiles || [])
  }, [uploadedFiles, getBanners])

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: FileWithPath) => {
      if (!uploadedFiles) return
      setUploadedFiles(uploadedFiles.filter((item) => item.name !== file.name))
    },
    [uploadedFiles]
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
                <Dropzone
                  mt="md"
                  onDrop={onDrop}
                  onReject={(files: any) => console.log('rejected files', files)}
                  maxSize={3 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                >
                  <Group align="center" position="center" p="sm" style={{ pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                      {/* <IconUpload
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: 'var(--mantine-color-blue-6)'
                        }}
                        stroke={1.5}
                      /> */}
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      {/* <IconX
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: 'var(--mantine-color-red-6)'
                        }}
                        stroke={1.5}
                      /> */}
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      {/* <ImageIcon
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: 'var(--mantine-color-dimmed)'
                        }}
                        stroke={1.5}
                      /> */}
                    </Dropzone.Idle>
                    <div>
                      <Group position="center" mb="sm">
                        <ImageIcon size="20px" />
                        <HtmlIcon size="20px" />
                      </Group>

                      <Text size="sm" inline>
                        Drop your file(s) here, or upload from your device.
                      </Text>
                      <Text size="xs" c="dimmed" inline mt={7}>
                        Accepted format: jpeg, png and for html banners zip file.
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </>
            )}
          </Grid.Col>
          <Grid.Col>
            <Grid>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <Grid.Col>
                  <Checkbox
                    checked={autoUTMChecked}
                    label="Auto UTM tracking"
                    onChange={(event) => setAutoUTMChecked(event.currentTarget.checked)}
                  />
                </Grid.Col>
              )}
              {(Object.keys(imagesInfo) as ShapeVariants[]).map((key: ShapeVariants) => {
                const images = imagesInfo[key]?.fileDetails || []
                if (images.length === 0) return
                const toRemove = key.toString() === 'others'

                return images.map((image) => (
                  <Grid.Col key={image.path}>
                    <ImageUrlInput
                      image={image}
                      toRemove={toRemove}
                      onDelete={handleDeleteCreativeBtnClicked}
                    />
                  </Grid.Col>
                ))
              })}
            </Grid>
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
