import { ActionIcon, Input, Text } from '@mantine/core'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import MediaBanner from 'components/common/MediaBanner'
import { useCallback } from 'react'
import DeleteIcon from 'resources/icons/Delete'
import { ImageUrlInputProps } from 'types'

const ImageUrlInput = ({
  image,
  toRemove,
  onDelete,
  onChange,
  preview,
  ...rest
}: ImageUrlInputProps) => {
  const getRightSection = useCallback(() => {
    if (preview)
      return <Text size="xs" pr="xs">{`${image.banner?.format.w}x${image.banner?.format.h}`}</Text>

    if (!onDelete) return null

    return (
      <ActionIcon
        title="Remove"
        color="secondaryText"
        variant="transparent"
        onClick={() => onDelete(image)}
      >
        <DeleteIcon size="24px" />
      </ActionIcon>
    )
  }, [image, preview, onDelete])

  return (
    <>
      {toRemove && <InfoAlertMessage message="The banner size does not meet the requirements." />}
      <Input
        onChange={onChange}
        error={toRemove}
        disabled={toRemove || preview}
        defaultValue={image.banner?.targetUrl}
        type="url"
        variant="default"
        placeholder="Paste URL"
        size="lg"
        icon={<MediaBanner adUnit={image} />}
        rightSection={getRightSection()}
        {...rest}
      />
    </>
  )
}

export default ImageUrlInput
