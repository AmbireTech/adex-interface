import { Flex, createStyles, Text } from '@mantine/core'

const useStyles = createStyles((theme, { active }: { active: boolean }) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    height: 62,
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    border: '1px solid',
    borderColor: active ? 'blue' : theme.colors.decorativeBorders[theme.fn.primaryShade()],
    borderRadius: theme.radius.sm
  }
}))

const BannerSizeMock = ({ variant, active }: { variant: string; active: boolean }) => {
  const { classes } = useStyles({ active })
  return (
    <Flex direction="column" align="center">
      <div className={classes.wrapper}>{/* <div className={classes.inner} /> */}</div>
      <Text size="sm">{variant}</Text>
    </Flex>
  )
}

export default BannerSizeMock
