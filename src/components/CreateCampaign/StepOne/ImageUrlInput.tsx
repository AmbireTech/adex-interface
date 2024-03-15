import { ActionIcon, Input, createStyles, Image, Text } from '@mantine/core'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { getMediaUrlWithProvider, isVideoMedia } from 'helpers/createCampaignHelpers'
import { useCallback } from 'react'
import DeleteIcon from 'resources/icons/Delete'
import { ImageUrlInputProps } from 'types'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useStyles = createStyles(() => ({
  image: {
    maxWidth: 40,
    maxHeight: 40
  },
  imageContainer: {
    maxWidth: 40,
    maxHeight: 40,
    overflow: 'hidden'
  }
}))

const ImageUrlInput = ({
  image,
  toRemove,
  onDelete,
  onChange,
  preview,
  ...rest
}: ImageUrlInputProps) => {
  const { classes } = useStyles()
  const mediaUrl = getMediaUrlWithProvider(image.banner?.mediaUrl, IPFS_GATEWAY)

  const getImageIcon = useCallback(() => {
    if (!image.banner) return null

    if (image.banner.mime === 'text/html') {
      return (
        <div className={classes.imageContainer}>
          <iframe
            title="htmlBanner"
            width={40}
            height={40}
            // src={mediaUrl}
            src="https://gateway.pinata.cloud/ipfs/QmW7S5HRLkP4XtPNyT1vQSjP3eRdtZaVtF6FAPvUfduMjA"
          />
        </div>
      )
    }

    if (isVideoMedia(image.banner.mime)) {
      return (
        <video width="40" height="40" autoPlay loop>
          <source src={mediaUrl} type="video/mp4" />
          <track src="captions_en.vtt" kind="captions" label="english_captions" />
        </video>
      )
    }

    return <Image src={mediaUrl} alt={image.title} className={classes.image} />
  }, [classes.image, classes.imageContainer, image.banner, image.title, mediaUrl])

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
        icon={getImageIcon()}
        rightSection={getRightSection()}
        {...rest}
      />
    </>
  )
}

export default ImageUrlInput
