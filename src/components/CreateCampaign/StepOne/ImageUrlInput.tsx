import {
  ActionIcon,
  Input,
  createStyles,
  Image,
  MantineStyleSystemProps,
  Text
} from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { getMediaUrlWithProvider, isVideoMedia } from 'helpers/createCampaignHelpers'
import { ChangeEventHandler } from 'react'
import DeleteIcon from 'resources/icons/Delete'

type ImageUrlInputProps = MantineStyleSystemProps & {
  image: AdUnit
  toRemove?: boolean
  onDelete?: (file: AdUnit) => void
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined
  preview?: boolean
}

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
  const mediaUrl = getMediaUrlWithProvider(
    image.banner?.mediaUrl,
    'https://ipfs.adex.network/ipfs/'
  )

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
        icon={
          image.banner?.mime !== 'text/html' ? (
            isVideoMedia(image.banner?.mime) ? (
              <video width="40" height="40" autoPlay loop>
                <source src={mediaUrl} type="video/mp4" />
                <track src="captions_en.vtt" kind="captions" label="english_captions" />
              </video>
            ) : (
              <Image src={mediaUrl} alt={image.title} className={classes.image} />
            )
          ) : (
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
        rightSection={
          !preview ? (
            <ActionIcon
              title="Remove"
              color="secondaryText"
              variant="transparent"
              onClick={() => onDelete && onDelete(image)}
            >
              <DeleteIcon size="24px" />
            </ActionIcon>
          ) : (
            <Text size="xs" pr="xs">
              {image.banner?.format.w}x{image.banner?.format.h}
            </Text>
          )
        }
        {...rest}
      />
    </>
  )
}

export default ImageUrlInput
