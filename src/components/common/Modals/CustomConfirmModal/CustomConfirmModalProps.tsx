import { Stack, MantineColor, Text, ThemeIcon, lighten } from '@mantine/core'
import { ConfirmModalProps } from '@mantine/modals/lib/ConfirmModal'
import AttentionIcon from 'resources/icons/Attention'
import { DEFAULT_PRIMARY_SHADE } from 'themes/base'
import { ModalSettings } from '@mantine/modals/lib/context'

type CustomConfirmModalProps = ConfirmModalProps &
  ModalSettings & {
    color?: MantineColor
    text: string | React.ReactNode
  }

export const defaultConfirmModalProps = ({
  color = 'attention',
  text,
  labels,
  cancelProps,
  confirmProps,
  ...rest
}: ConfirmModalProps & CustomConfirmModalProps): ConfirmModalProps & ModalSettings => {
  return {
    centered: true,
    withCloseButton: false,
    padding: 0,
    children: (
      <Stack
        align="center"
        p="xl"
        gap="lg"
        style={(theme) => ({
          backgroundColor: lighten(
            theme.colors[color][DEFAULT_PRIMARY_SHADE],
            theme.other.shades.lighten.lightest
          )
        })}
      >
        <ThemeIcon size="xl" variant="light" radius="xl" color={color}>
          <AttentionIcon size="24px" />
        </ThemeIcon>

        <Text>{text}</Text>
      </Stack>
    ),
    labels: labels || { confirm: 'confirm', cancel: 'cancel' },
    cancelProps: { color: 'brand', variant: 'outline', size: 'md', ...cancelProps },
    confirmProps: { color: 'brand', variant: 'filled', size: 'md', ...confirmProps },
    groupProps: { justify: 'space-between', pb: 'md', px: 'md' },
    ...rest
  }
}
