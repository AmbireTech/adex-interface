import {
  ActionIcon,
  Flex,
  FlexProps,
  Input,
  MantineTheme,
  Text,
  getPrimaryShade
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { UseFormReturnType } from '@mantine/form'
import { useColorScheme } from '@mantine/hooks'
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
        ? theme.colors.error[primaryShade]
        : theme.colors.decorativeBorders[primaryShade]
    },
    wrapper: {
      backgroundColor: theme.colors.lightBackground[primaryShade],
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade],
      borderRadius: theme.radius.md,
      '&:focus-within': {
        borderColor: hasError ? theme.colors.error[primaryShade] : theme.colors.brand[primaryShade],
        '#mediaWrapper': {
          borderColor: hasError
            ? theme.colors.error[primaryShade]
            : theme.colors.brand[primaryShade]
        }
      }
    },
    inputError: {
      borderColor: theme.colors.error[primaryShade],
      '#mediaWrapper': {
        borderColor: theme.colors.error[primaryShade]
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
  onBlur,
  preview,
  index,
  form,
  ...rest
}: ImageUrlInputProps) => {
  const hasError: boolean = useMemo(
    () =>
      (form?.errors[`adUnits.${index}.banner.targetUrl`] &&
        form?.errors[`adUnits.${index}.banner.targetUrl`] !== '') ||
      !!toRemove,
    [form?.errors, index, toRemove]
  )

  const { classes, cx } = useStyles({ hasError })

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
          color={hasError ? 'error' : 'brand'}
          text={`${image.banner?.format.w}x${image.banner?.format.h}`}
        />
        <Input
          defaultValue={!form ? image.banner?.targetUrl : undefined}
          className={classes.inputField}
          error={hasError}
          disabled={toRemove || preview}
          type="url"
          variant="unstyled"
          placeholder="Please enter a target URL starting with https://"
          size="md"
          classNames={{
            section: classes.rightSection,
            input: classes.input
          }}
          {...(form
            ? {
                key: form.key(`adUnits.${index}.banner.targetUrl`),
                ...form.getInputProps(`adUnits.${index}.banner.targetUrl`)
              }
            : {})}
        />
        {(!preview || onDelete) && (
          <ActionIcon
            mr="sm"
            title="Remove"
            color="secondaryText"
            variant="transparent"
            onClick={() => onDelete && typeof index !== 'undefined' && onDelete(index)}
          >
            <DeleteIcon size="24px" />
          </ActionIcon>
        )}
      </Flex>
      {form?.errors[`adUnits.${index}.banner.targetUrl`] && (
        <Text c="error">{form?.errors[`adUnits.${index}.banner.targetUrl`]}</Text>
      )}
    </>
  )
}

export default ImageUrlInput
