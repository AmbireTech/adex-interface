import { ActionIcon, Input, createStyles, Image } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { isVideoMedia } from 'helpers/createCampaignHelpers'
import { ChangeEventHandler } from 'react'
import DeleteIcon from 'resources/icons/Delete'

type ImageUrlInputProps = {
  image: AdUnit
  toRemove: boolean
  onDelete: (file: AdUnit) => void
  onChange: ChangeEventHandler<HTMLInputElement> | undefined
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

const ImageUrlInput = ({ image, toRemove, onDelete, onChange }: ImageUrlInputProps) => {
  const { classes } = useStyles()
  return (
    <>
      {toRemove && <InfoAlertMessage message="The banner size does not meet the requirements." />}
      <Input
        onChange={onChange}
        error={toRemove}
        disabled={toRemove}
        defaultValue={image.banner?.targetUrl}
        type="url"
        variant="default"
        placeholder="Paste URL"
        size="lg"
        icon={
          image.banner?.mime !== 'text/html' ? (
            isVideoMedia(image.banner?.mime) ? (
              <video width="40" height="40" autoPlay loop>
                <source src={image.banner?.mediaUrl} type="video/mp4" />
                <track src="captions_en.vtt" kind="captions" label="english_captions" />
              </video>
            ) : (
              <Image src={image.banner?.mediaUrl} alt={image.title} className={classes.image} />
            )
          ) : (
            <div className={classes.imageContainer}>
              <iframe
                title="kor"
                width={40}
                height={40}
                src={`data:text/html;base64,${image.banner?.mediaUrl}`}
              />
            </div>
          )
        }
        rightSection={
          <ActionIcon
            title="Remove"
            color="secondaryText"
            variant="transparent"
            onClick={() => onDelete(image)}
          >
            <DeleteIcon size="24px" />
          </ActionIcon>
        }
      />
    </>
  )
}

export default ImageUrlInput
