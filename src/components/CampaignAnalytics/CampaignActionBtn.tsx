import {
  Flex,
  Text,
  Button,
  MantineColor,
  ButtonProps,
  MantineTheme,
  getPrimaryShade,
  lighten
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'

type CampaignActionBtnProps = ButtonProps & {
  text: string
  icon: React.ReactNode
  color: MantineColor
  onBtnClicked: () => void
}

const useStyles = createStyles((theme: MantineTheme, { color }: { color: MantineColor }) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    btn: {
      background: lighten(theme.colors[color][primaryShade], theme.other.shades.lighten.lightest),
      fontWeight: 'normal',
      textTransform: 'capitalize',
      '&:hover': {
        background: theme.colors[color][primaryShade],
        color: 'white'
      }
    }
  }
})

const CampaignActionBtn = ({
  text,
  icon,
  color,
  onBtnClicked,
  ...rest
}: CampaignActionBtnProps) => {
  const { classes } = useStyles({ color })
  return (
    <Button
      size="md"
      variant="outline"
      color={color}
      onClick={onBtnClicked}
      className={classes.btn}
      {...rest}
    >
      <Flex align="center" wrap="nowrap">
        <Text mr="xs">{text}</Text>
        {icon}
      </Flex>
    </Button>
  )
}

export default CampaignActionBtn
