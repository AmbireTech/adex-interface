import { ActionIcon, Flex, Input, Text, createStyles, getStylesRef } from '@mantine/core'
import CustomBadge from 'components/common/CustomBadge'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import MediaBanner from 'components/common/MediaBanner'
import { isValidHttpUrl } from 'helpers/validators'
import { useCallback, useState } from 'react'
import DeleteIcon from 'resources/icons/Delete'
import { ImageUrlInputProps } from 'types'

const useStyles = createStyles((theme) => {
  const smallerSpacing = `${Number(theme.spacing.xs.split('rem')[0]) * 0.8}rem`

  return {
    inputField: {
      ref: getStylesRef('inputField'),
      flexGrow: 1
    },
    mediaWrapper: {
      ref: getStylesRef('mediaWrapper'),
      borderRight: '1px solid',
      borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
      padding: smallerSpacing
    },
    wrapper: {
      backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
      borderRadius: theme.radius.md,
      '&:focus-within': {
        borderColor: theme.colors.brand[theme.fn.primaryShade()],
        [`& .${getStylesRef('mediaWrapper')}`]: {
          borderColor: theme.colors.brand[theme.fn.primaryShade()]
        },
        [`& .${getStylesRef('inputField')}`]: {
          color: theme.colors.brand[theme.fn.primaryShade()]
        }
      }
    },
    inputError: {
      borderColor: theme.colors.warning[theme.fn.primaryShade()],
      [`& .${getStylesRef('mediaWrapper')}`]: {
        borderColor: theme.colors.warning[theme.fn.primaryShade()]
      }
    },
    infoError: {
      padding: theme.spacing.xs
    },
    rightSection: {
      backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()]
    }
  }
})

const ImageUrlInput = ({
  image,
  toRemove,
  onDelete,
  onChange,
  preview,
  ...rest
}: ImageUrlInputProps) => {
  const { classes, cx } = useStyles()
  const [error, setError] = useState('')

  const getRightSection = useCallback(() => {
    if (preview || !onDelete) return null

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

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target

      if (value.length > 8 && !isValidHttpUrl(value)) {
        setError('Please enter a valid URL')
      } else {
        setError('')
      }

      onChange?.(event)
    },
    [onChange]
  )

  return (
    <>
      {toRemove && (
        <div className={classes.infoError}>
          <InfoAlertMessage message="The banner size does not meet the requirements." />
        </div>
      )}
      <Flex
        justify="flex-start"
        align="center"
        gap="xs"
        className={cx(classes.wrapper, { [classes.inputError]: error || toRemove })}
        {...rest}
      >
        <div className={classes.mediaWrapper}>
          <MediaBanner adUnit={image} zoomOnHover />
        </div>
        <CustomBadge
          color={error || toRemove ? 'warning' : 'brand'}
          text={`${image.banner?.format.w}x${image.banner?.format.h}`}
        />
        <Input
          className={classes.inputField}
          onChange={handleChange}
          error={toRemove}
          disabled={toRemove || preview}
          defaultValue={image.banner?.targetUrl}
          type="url"
          variant="unstyled"
          placeholder="Please enter a target URL starting with https://"
          size="md"
          rightSection={getRightSection()}
          classNames={{
            rightSection: classes.rightSection
          }}
        />
        {error && <Text color="warning">{error}</Text>}
      </Flex>
    </>
  )
}

export default ImageUrlInput
