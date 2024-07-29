import { ButtonProps, Flex, MantineColor, Text, createStyles } from '@mantine/core'
import { PropsWithChildren } from 'react'
import AttentionIcon from 'resources/icons/Attention'

const useStyles = createStyles((theme, { color }: { color: MantineColor }) => ({
  confirmModalContent: {
    background:
      theme.colors[color][theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest,
    padding: theme.spacing.xl
  },
  iconWrapper: {
    width: 50,
    height: 50,
    background: `${theme.colors[color][theme.fn.primaryShade()]}1A`,
    borderRadius: '50%',
    padding: theme.spacing.sm
  },
  attentionIcon: {
    width: 25,
    height: 25,
    color: theme.colors.attention[theme.fn.primaryShade()]
  },
  root: {
    padding: 0
  }
}))

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
