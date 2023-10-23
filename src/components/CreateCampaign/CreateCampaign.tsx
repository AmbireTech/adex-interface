import { useState } from 'react'
import { Button, Flex, Grid, Group, Stepper, createStyles, Text } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import MobileIcon from 'resources/icons/Mobile'
import DesktopIcon from 'resources/icons/Desktop'
import { Devices } from 'types'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import ImageIcon from 'resources/icons/Image'
import HtmlIcon from 'resources/icons/Html'
import BannerSizesList from './BannerSizesList'

const useStyles = createStyles((theme) => {
  return {
    // TODO: Think about the idea to add the common container styles in the theme
    container: {
      backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.xs,
      padding: theme.spacing.lg
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

  // Stepper
  const [active, setActive] = useState(1)
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  // Mobile/Desktop tabs
  const [selectedTab, setSelectedTab] = useState<Devices | null>(null)

  const [imagesInfo, setImagesInfo] = useState<{ width: number; height: number }[]>([])

  const onDrop = (files: any) => {
    files.length &&
      files.forEach((file: any) => {
        const reader = new FileReader()

        reader.onload = (e: any) => {
          const img = new Image()
          img.src = e.target.result

          img.onload = () => {
            const width = img.width
            const height = img.height
            console.log('size', width, height)
            setImagesInfo((prev) => [...prev, { width, height }])
          }
        }

        reader.readAsDataURL(file)
      })
  }
  console.log('imageInfo', imagesInfo)
  return (
    <Grid mr="xl" ml="xl" mt="md">
      <Grid.Col span={8} className={classes.container}>
        <Grid p="md">
          <Grid.Col>
            <Stepper icon={' '} size="xs" active={active} onStepClick={setActive}>
              <Stepper.Step />
              <Stepper.Step />
              <Stepper.Step />
            </Stepper>

            <Group mt="xl">
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next step</Button>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <Text color="secondaryText" size="sm" weight="bold" mb="xs">
              1. Select device
            </Text>
            <Flex gap={20}>
              <CustomCard
                width={164}
                height={164}
                icon={<MobileIcon size="60px" />}
                text="Mobile"
                color="brand"
                active={selectedTab === 'mobile'}
                action={() => setSelectedTab('mobile')}
              />
              <CustomCard
                width={164}
                height={164}
                icon={<DesktopIcon size="60px" />}
                text="Desktop"
                color="brand"
                active={selectedTab === 'desktop'}
                action={() => setSelectedTab('desktop')}
              />
            </Flex>
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
                {/* TODO: FIX Styles of BannerSizesList, responsive! */}
                <BannerSizesList selectedTab={selectedTab} />
                <Dropzone
                  mt="md"
                  onDrop={onDrop}
                  onReject={(files: any) => console.log('rejected files', files)}
                  maxSize={3 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  //   {...props}
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
        </Grid>
      </Grid.Col>
      <Grid.Col span={3} offset={1} className={classes.container}>
        Test
      </Grid.Col>
    </Grid>
  )
}

export default CreateCampaign
