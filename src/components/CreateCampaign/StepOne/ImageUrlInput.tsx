import { ActionIcon, Flex, Input, Text } from '@mantine/core'
import { createStyles, getStylesRef } from '@mantine/emotion'
import CustomBadge from 'components/common/CustomBadge'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import MediaThumb from 'components/common/MediaThumb'
import { useCallback, useMemo } from 'react'
import DeleteIcon from 'resources/icons/Delete'
import { ImageUrlInputProps } from 'types'

const useStyles = createStyles((theme, { hasError }: { hasError: boolean }) => {
  const smallerSpacing = `${Number(theme.spacing.xs.split('rem')[0]) * 0.8}rem`

  return {
    inputField: {
      ref: getStylesRef('inputField'),
      flexGrow: 1
    },
    mediaWrapper: {
      ref: getStylesRef('mediaWrapper'),
      borderRight: '1px solid',
      borderColor: theme.colors.decorativeBorders[3],
      padding: smallerSpacing
    },
    wrapper: {
      backgroundColor: theme.colors.lightBackground[3],
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[3],
      borderRadius: theme.radius.md,
      '&:focus-within': {
        borderColor: hasError ? theme.colors.warning[3] : theme.colors.brand[3],
        [`& .${getStylesRef('mediaWrapper')}`]: {
          borderColor: hasError ? theme.colors.warning[3] : theme.colors.brand[3]
        },
        [`& .${getStylesRef('inputField')}`]: {
          borderColor: hasError ? theme.colors.warning[3] : theme.colors.brand[3]
        }
      }
    },
    inputError: {
      borderColor: theme.colors.warning[3],
      [`& .${getStylesRef('mediaWrapper')}`]: {
        borderColor: theme.colors.warning[3]
      }
    },
    infoError: {
      padding: theme.spacing.xs
    },
    rightSection: {
      backgroundColor: theme.colors.lightBackground[3]
    }
  }
})

const ImageUrlInput = ({
  image,
  toRemove,
  onDelete,
  onChange,
  preview,
  error,
  ...rest
}: ImageUrlInputProps) => {
  const hasError: boolean = useMemo(
    () => (!error?.success && error?.isDirty) || (!error?.success && error?.isDirty) || !!toRemove,
    [error, toRemove]
  )
  const { classes, cx } = useStyles({ hasError })

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
        className={cx(classes.wrapper, { [classes.inputError]: hasError })}
        {...rest}
      >
        <div className={classes.mediaWrapper}>
          <MediaThumb adUnit={image} />
        </div>
        <CustomBadge
          color={hasError ? 'warning' : 'brand'}
          text={`${image.banner?.format.w}x${image.banner?.format.h}`}
        />
        <Input
          className={classes.inputField}
          onChange={handleChange}
          error={hasError}
          disabled={toRemove || preview}
          defaultValue={image.banner?.targetUrl}
          type="url"
          variant="unstyled"
          placeholder="Please enter a target URL starting with https://"
          size="md"
          rightSection={getRightSection()}
          classNames={{
            section: classes.rightSection
          }}
        />
      </Flex>
      {error?.errMsg && <Text color="warning">{error?.errMsg}</Text>}
    </>
  )
}

export default ImageUrlInput
