import { ActionIcon, Input, createStyles, Text, Group } from '@mantine/core'
import DeleteIcon from 'resources/icons/Delete'
import InfoIcon from 'resources/icons/Info'
import { FileWithPath } from 'types'

type ImageUrlInputProps = {
  image: FileWithPath
  toRemove: boolean
  onDelete: (file: FileWithPath) => void
}

const useStyles = createStyles((theme) => ({
  image: {
    maxWidth: 40,
    maxHeight: 40
  },
  errorWrapper: {
    height: 60,
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    boxShadow: theme.shadows.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm
  },
  errorIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      theme.colors.warning[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest,
    height: 60,
    width: 60,
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
    color: theme.colors.warning[theme.fn.primaryShade()]
  }
}))

const ImageUrlInput = ({ image, toRemove, onDelete }: ImageUrlInputProps) => {
  const { classes } = useStyles()

  return (
    <>
      {toRemove && (
        <Group className={classes.errorWrapper}>
          <div className={classes.errorIcon}>
            <InfoIcon size="24px" />
          </div>
          <Text size="sm"> The banner size does not meet the requirements.</Text>
        </Group>
      )}
      <Input
        error={toRemove}
        disabled={toRemove}
        type="url"
        variant="default"
        placeholder="Paste URL"
        size="xl"
        icon={<img src={URL.createObjectURL(image)} alt={image.name} className={classes.image} />}
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
