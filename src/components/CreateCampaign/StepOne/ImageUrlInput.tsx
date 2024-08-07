import { ActionIcon, Flex, Input, MantineTheme, Text, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import CustomBadge from 'components/common/CustomBadge'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import MediaThumb from 'components/common/MediaThumb'
import { useCallback, useMemo } from 'react'
import DeleteIcon from 'resources/icons/Delete'
import { ImageUrlInputProps } from 'types'

const useStyles = createStyles((theme: MantineTheme, { hasError }: { hasError: boolean }) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    inputField: {
      flexGrow: 1
    },
    input: {
      border: 'none'
    },
    mediaWrapper: {
      borderRight: '1px solid',
      padding: theme.spacing.xs,
      borderColor: hasError
        ? theme.colors.warning[primaryShade]
        : theme.colors.decorativeBorders[primaryShade]
    },
    wrapper: {
      backgroundColor: theme.colors.lightBackground[primaryShade],
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade],
      borderRadius: theme.radius.md,
      '&:focus-within': {
        borderColor: hasError
          ? theme.colors.warning[primaryShade]
          : theme.colors.brand[primaryShade],
        '#mediaWrapper': {
          borderColor: hasError
            ? theme.colors.warning[primaryShade]
            : theme.colors.brand[primaryShade]
        }
      }
    },
    inputError: {
      borderColor: theme.colors.warning[primaryShade],
      '#mediaWrapper': {
        borderColor: theme.colors.warning[primaryShade]
      }
    },
    infoError: {
      paddingBottom: theme.spacing.xs
    },
    rightSection: {
      backgroundColor: theme.colors.lightBackground[primaryShade]
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
        <div id="mediaWrapper" className={classes.mediaWrapper}>
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
          classNames={{
            section: classes.rightSection,
            input: classes.input
          }}
        />
        {(!preview || onDelete) && (
          <ActionIcon
            mr="sm"
            title="Remove"
            color="secondaryText"
            variant="transparent"
            onClick={() => onDelete && onDelete(image)}
          >
            <DeleteIcon size="24px" />
          </ActionIcon>
        )}
      </Flex>
      {error?.errMsg && <Text c="warning">{error?.errMsg}</Text>}
    </>
  )
}

export default ImageUrlInput
