import {
  Button,
  Box,
  Group,
  Text,
  Flex,
  rem,
  Title,
  createStyles,
  ThemeIcon,
  MantineColor
} from '@mantine/core'
import { useHover } from '@mantine/hooks'

interface StylesProps {
  color: MantineColor
  hovered: boolean
}

const useStyles = createStyles((theme, { color, hovered }: StylesProps) => ({
  wrapper: {
    transition: theme.transitionTimingFunction,
    backgroundColor: hovered
      ? theme.fn.lighten(theme.colors[color][theme.fn.primaryShade()], 0.97)
      : theme.white,
    textAlign: 'center',
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    height: rem(330),
    width: rem(294),
    border: '1px solid',
    borderColor: hovered
      ? theme.colors[color][theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lighter
      : theme.colors.gray[1],
    boxShadow: hovered ? theme.shadows.md : ''
  },
  icon: {
    transition: theme.transitionTimingFunction,
    transform: hovered ? 'scale(1.5)' : 'scale(1)'
  },
  button: {
    padding: '0'
  }
}))

const CustomCard = ({
  icon,
  color,
  title,
  text,
  buttonLabel,
  action
}: {
  icon: React.ReactNode
  color: MantineColor
  title: string
  text: string
  buttonLabel: string
  action: () => void
}) => {
  const { hovered, ref } = useHover()
  const { classes } = useStyles({ color, hovered })

  return (
    <Box ref={ref} className={classes.wrapper}>
      <Flex mih={50} gap="sm" justify="center" align="center" direction="column" wrap="wrap">
        <Title mt="sm" color="gray.5" order={2}>
          {title}
        </Title>
        <Box className={classes.icon}>
          <ThemeIcon
            variant="outline"
            color={color}
            size={rem(60)}
            style={{ border: 'none', background: 'none' }}
          >
            {icon}
          </ThemeIcon>
        </Box>
        <Group position="apart" mb="xs">
          <Text size="lg" w={rem(160)}>
            {text}
          </Text>
        </Group>
        <Button
          w="75%"
          onClick={action}
          size="lg"
          variant="outline"
          mt="sm"
          color={color}
          className={classes.button}
        >
          {buttonLabel}
        </Button>
      </Flex>
    </Box>
  )
}

export default CustomCard
