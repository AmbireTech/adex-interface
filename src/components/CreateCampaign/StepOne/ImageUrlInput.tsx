import { ActionIcon, Divider, FlexProps, TextInput, Group, ThemeIcon, Box } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { AdUnit } from 'adex-common'
import CustomBadge from 'components/common/CustomBadge'
import MediaThumb from 'components/common/MediaThumb'
import { useMemo } from 'react'
import DeleteIcon from 'resources/icons/Delete'
import { CampaignUI } from 'types'
import InfoCurlyBorder from 'resources/icons/InfoCurlyBorder'

type ImageUrlInputProps = FlexProps & {
  image: AdUnit
  onDelete?: (index: number) => void
  preview?: boolean
  index?: number
  form?: UseFormReturnType<CampaignUI, (values: CampaignUI) => CampaignUI>
}

const ImageUrlInput = ({ image, onDelete, preview, index, form }: ImageUrlInputProps) => {
  const hasFormatError: boolean = useMemo(
    () => !!form?.errors[`adUnits.${index}.banner.format`],
    [form?.errors, index]
  )

  const hasError: boolean = useMemo(
    () => hasFormatError || !!form?.errors[`adUnits.${index}.banner.targetUrl`],
    [form?.errors, hasFormatError, index]
  )

  const disable: boolean = useMemo(
    () => !!preview || !!form?.errors[`adUnits.${index}.banner.format`],
    [form?.errors, index, preview]
  )

  return (
    <TextInput
      onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
      defaultValue={!form ? image.banner?.targetUrl : undefined}
      disabled={disable}
      placeholder="Please enter a target URL starting with https://"
      // withErrorStyles={false}
      size="lg"
      {...(hasFormatError
        ? {
            key: form?.key(`adUnits.${index}.banner.format`),
            ...form?.getInputProps(`adUnits.${index}.banner.format`),
            value: index !== undefined && form?.getValues().adUnits[index].title
          }
        : {
            key: form?.key(`adUnits.${index}.banner.targetUrl`),
            ...form?.getInputProps(`adUnits.${index}.banner.targetUrl`)
          })}
      // TODO: fix it
      leftSectionWidth="170px"
      leftSectionPointerEvents="visible"
      leftSectionProps={{
        style: {
          justifyContent: 'start',
          padding: 0,
          overflow: 'hidden'
        }
      }}
      leftSection={
        <Group gap="0" justify="left" align="center" h="100%">
          {hasFormatError ? (
            <ThemeIcon color="warning" variant="light" h="100%" w={54} px="xs" radius={0}>
              <InfoCurlyBorder />
            </ThemeIcon>
          ) : (
            <Box px="xs">
              <MediaThumb width={34} height={34} adUnit={image} />
            </Box>
          )}

          <Divider
            size="xs"
            orientation="vertical"
            mr="sm"
            color={hasError ? 'warning' : undefined}
            styles={{ root: { borderColor: 'inherit', opacity: 'inherit' } }}
          />

          <CustomBadge
            p="sm"
            color={hasError ? 'warning' : 'brand'}
            text={`${image.banner?.format.w}x${image.banner?.format.h}`}
          />
        </Group>
      }
      rightSectionPointerEvents="visible"
      rightSectionProps={{
        style: {
          justifyContent: 'end'
        }
      }}
      rightSection={
        (!preview || onDelete) && (
          <ActionIcon
            // mr="sm"
            h="100%"
            title="Remove"
            color="secondaryText"
            variant="subtle"
            size="xl"
            onClick={() => onDelete && typeof index !== 'undefined' && onDelete(index)}
          >
            <DeleteIcon size="24px" />
          </ActionIcon>
        )
      }
    />
  )
}

export default ImageUrlInput
