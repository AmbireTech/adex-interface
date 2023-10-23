import { Flex, createStyles, Text } from '@mantine/core'

type ShapeVariants =
  | 'mediumRectangle'
  | 'skyscraper'
  | 'leaderboard'
  | 'billboard'
  | 'halfPage'
  | 'mobileBanner'
  | 'mobileLeaderboard'

const variants = {
  mediumRectangle: {
    width: 32,
    height: 26,
    bannerSizes: '300x250',
    bannerName: 'Medium rectangle',
    checked: false
  },
  skyscraper: {
    width: 16,
    height: 60,
    bannerSizes: '160x600',
    bannerName: 'Skyscraper',
    checked: false
  },
  leaderboard: {
    width: 88,
    height: 12,
    bannerSizes: '728x90',
    bannerName: 'Leaderboard',
    checked: false
  },
  billboard: {
    width: 96,
    height: 27,
    bannerSizes: '970x250',
    bannerName: 'Billboard',
    checked: false
  },
  halfPage: {
    width: 32,
    height: 64,
    bannerSizes: '300x600',
    bannerName: 'Half Page',
    checked: false
  },
  mobileBanner: {
    width: 86,
    height: 14,
    bannerSizes: '300x50',
    bannerName: 'Mobile Banner',
    checked: false
  },
  mobileLeaderboard: {
    width: 90,
    height: 14,
    bannerSizes: '320x50',
    bannerName: 'Mobile Leaderboard',
    checked: false
  }
}

const useStyles = createStyles((theme, { variant }: { variant: ShapeVariants }) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 112,
    height: 96,
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    // boxShadow: theme.shadows.sm,
    borderRadius: theme.radius.sm
  },
  inner: {
    width: variants[variant].width,
    height: variants[variant].height,
    backgroundColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    borderRadius: theme.radius.xs
  }
}))

const BannerSizeMock = ({ variant }: { variant: ShapeVariants }) => {
  const { classes } = useStyles({ variant })
  return (
    <Flex direction="column" align="center">
      <div className={classes.wrapper}>
        <div className={classes.inner} />
        {/* <Text size="sm" style={{ position: 'absolute' }}>
          {variants[variant].bannerSizes}
        </Text> */}
      </div>
      <Text size="sm">{variants[variant].bannerSizes}</Text>
      {/* <Text size="sm">{variants[variant].bannerName}</Text> */}
    </Flex>
  )
}

export default BannerSizeMock
