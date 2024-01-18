import { ActionIcon, Input, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
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
        type="url"
        variant="default"
        placeholder="Paste URL"
        size="lg"
        icon={
          <img
            src={`data:image/png;base64,${image.banner?.mediaUrl}`}
            alt={image.title}
            className={classes.image}
          />
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
