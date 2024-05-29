import { Flex, createStyles, Text, Indicator } from '@mantine/core'

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

const BannerSizeMock = ({
  variant,
  active,
  addedBannerCount
}: {
  variant: string
  active: boolean
  addedBannerCount: number | undefined
}) => {
  const { classes } = useStyles({ active })

  return (
    <Indicator
      disabled={!addedBannerCount && !active}
      inline
      label={!!addedBannerCount && addedBannerCount}
      size={16}
    >
      <Flex direction="column" align="center">
        <div className={classes.wrapper}>
          <Text size="sm">{variant}</Text>
        </div>
      </Flex>
    </Indicator>
  )
}

export default BannerSizeMock
