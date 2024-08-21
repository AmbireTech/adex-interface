import { ActionIcon, Divider, FlexProps, TextInput, Group } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { AdUnit } from 'adex-common'
import CustomBadge from 'components/common/CustomBadge'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import MediaThumb from 'components/common/MediaThumb'
import { useMemo } from 'react'
import DeleteIcon from 'resources/icons/Delete'
import { CampaignUI } from 'types'

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
    () => hasFormatError || !!form?.errors[`adUnits.${index}.banner.format`],
    [form?.errors, hasFormatError, index]
  )

  const disable: boolean = useMemo(
    () => !!preview || !!form?.errors[`adUnits.${index}.banner.format`],
    [form?.errors, index, preview]
  )

  return (
    <>
      {hasFormatError && (
        <InfoAlertMessage
          message={form?.errors[`adUnits.${index}.banner.format`]?.toString() || ''}
        />
      )}

      <TextInput
        onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
        defaultValue={!form ? image.banner?.targetUrl : undefined}
        disabled={disable}
        type="url"
        placeholder="Please enter a target URL starting with https://"
        size="lg"
        {...(form
          ? {
              key: form.key(`adUnits.${index}.banner.targetUrl`),
              ...form.getInputProps(`adUnits.${index}.banner.targetUrl`)
            }
          : {})}
        // TODO: fix it
        leftSectionWidth="180px"
        leftSectionPointerEvents="visible"
        leftSection={
          <Group c="inherit" gap="sm" justify="left" h="100%">
            <MediaThumb width={36} height={36} adUnit={image} />
            <Divider
              size="xs"
              orientation="vertical"
              styles={{ root: { borderColor: 'inherit' } }}
            />
            <CustomBadge
              color={hasError ? 'warning' : 'brand'}
              text={`${image.banner?.format.w}x${image.banner?.format.h}`}
            />
          </Group>
        }
        rightSectionPointerEvents="visible"
        rightSection={
          (!preview || onDelete) && (
            <ActionIcon
              mr="sm"
              title="Remove"
              color="secondaryText"
              variant="transparent"
              onClick={() => onDelete && typeof index !== 'undefined' && onDelete(index)}
            >
              <DeleteIcon size="24px" />
            </ActionIcon>
          )
        }
      />
    </>
  )
}

export default ImageUrlInput
