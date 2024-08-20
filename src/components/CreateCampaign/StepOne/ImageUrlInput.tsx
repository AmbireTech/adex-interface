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
  toRemove?: boolean
  onDelete?: (index: number) => void
  preview?: boolean
  index?: number
  form?: UseFormReturnType<CampaignUI, (values: CampaignUI) => CampaignUI>
}

const ImageUrlInput = ({
  image,
  toRemove,
  onDelete,
  // onChange,
  // onBlur,
  preview,
  index,
  form
}: ImageUrlInputProps) => {
  const hasError: boolean = useMemo(
    () =>
      !!form?.errors[`adUnits.${index}.banner.targetUrl`] ||
      !!form?.errors[`adUnits.${index}.banner.format`] ||
      !!toRemove,
    [form?.errors, index, toRemove]
  )

  return (
    <>
      {!!form?.errors[`adUnits.${index}.banner.format`] && (
        <InfoAlertMessage message="The banner size does not meet the requirements." />
      )}

      <TextInput
        onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
        defaultValue={!form ? image.banner?.targetUrl : undefined}
        disabled={toRemove || preview}
        type="url"
        placeholder="Please enter a target URL starting with https://"
        size="lg"
        {...(form
          ? {
              key: form.key(`adUnits.${index}.banner.targetUrl`),
              ...form.getInputProps(`adUnits.${index}.banner.targetUrl`)
            }
          : {})}
        wrapperProps={{ style: { display: 'flex', flexDirection: 'column', width: '100%' } }}
        leftSectionWidth="170px"
        leftSectionProps={{
          style: {
            width: 'auto',
            padding: '14px'
          }
        }}
        leftSectionPointerEvents="visible"
        leftSection={
          <Group c="inherit" gap="xs" m="0">
            <MediaThumb width={30} height={30} adUnit={image} />

            <Divider size="xs" orientation="vertical" color={hasError ? 'error' : 'brand'} />
            <CustomBadge
              color={hasError ? 'error' : 'brand'}
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
