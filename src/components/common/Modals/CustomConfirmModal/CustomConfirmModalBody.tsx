import { ButtonProps, Stack, MantineColor, Text, ThemeIcon, lighten } from '@mantine/core'
import { PropsWithChildren } from 'react'
import AttentionIcon from 'resources/icons/Attention'
import { DEFAULT_PRIMARY_SHADE } from 'themes/base'

type CustomConfirmModalProps = ButtonProps &
  PropsWithChildren & {
    color?: MantineColor
    text: string | React.ReactNode
  }

export const CustomConfirmModalBody = ({ color = 'attention', text }: CustomConfirmModalProps) => {
  return (
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
      <ThemeIcon size="xl" variant="transparent" radius="xl" color={color}>
        <AttentionIcon size="24px" />
      </ThemeIcon>

      <Text>{text}</Text>
    </Stack>
  )
}
