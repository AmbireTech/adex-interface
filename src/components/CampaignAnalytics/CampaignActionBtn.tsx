import {
  Flex,
  Text,
  Button,
  createStyles,
  MantineColor,
  MantineStyleSystemProps
} from '@mantine/core'

type CampaignActionBtnProps = MantineStyleSystemProps & {
  text: string
  icon: React.ReactNode
  color: MantineColor
  onBtnClicked: () => void
}

const useStyles = createStyles((theme, { color }: { color: MantineColor }) => ({
  btn: {
    background:
      theme.colors[color][theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest,
    fontWeight: 'normal',
    textTransform: 'capitalize',
    '&:hover': {
      background: theme.colors[color][theme.fn.primaryShade()],
      color: 'white'
    }
  }
}))

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
