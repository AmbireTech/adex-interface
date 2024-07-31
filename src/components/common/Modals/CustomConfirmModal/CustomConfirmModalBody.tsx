import {
  ButtonProps,
  Flex,
  MantineColor,
  MantineTheme,
  Text,
  getPrimaryShade,
  lighten
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { PropsWithChildren } from 'react'
import AttentionIcon from 'resources/icons/Attention'

const useStyles = createStyles((theme: MantineTheme, { color }: { color: MantineColor }) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    confirmModalContent: {
      background: lighten(
        theme.colors[color][primaryShade],
        theme.other.shades.hexColorSuffix.lightest
      ),
      padding: theme.spacing.xl
    },
    iconWrapper: {
      width: 50,
      height: 50,
      background: `${theme.colors[color][primaryShade]}1A`,
      borderRadius: '50%',
      padding: theme.spacing.sm
    },
    attentionIcon: {
      width: 25,
      height: 25,
      color: theme.colors.attention[primaryShade]
    },
    root: {
      padding: 0
    }
  }
})

type ConfirmModalProps = ButtonProps &
  PropsWithChildren & {
    color?: MantineColor
    text: string | React.ReactNode
  }

export const CustomConfirmModalBody = ({ color = 'attention', text }: ConfirmModalProps) => {
  const { classes } = useStyles({ color })

  return (
    <Flex justify="center" className={classes.confirmModalContent}>
      <div className={classes.iconWrapper}>
        <AttentionIcon className={classes.attentionIcon} />
      </div>
      <Text w="100%" pt="xl">
        {text}
      </Text>
    </Flex>
  )
}
