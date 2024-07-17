import { Flex, Text, Indicator, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'

const useStyles = createStyles((theme: MantineTheme, { active }: { active: boolean }) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 72,
      height: 62,
      background: theme.colors.lightBackground[primaryShade],
      border: '1px solid',
      borderColor: active ? 'blue' : theme.colors.decorativeBorders[primaryShade],
      borderRadius: theme.radius.sm
    }
  }
})

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
