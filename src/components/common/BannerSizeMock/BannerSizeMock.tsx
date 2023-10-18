import { createStyles } from '@mantine/core'

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
    height: 26
  },
  skyscraper: {
    width: 16,
    height: 60
  },
  leaderboard: {
    width: 88,
    height: 12
  },
  billboard: {
    width: 96,
    height: 27
  },
  halfPage: {
    width: 32,
    height: 64
  },
  mobileBanner: {
    width: 86,
    height: 14
  },
  mobileLeaderboard: {
    width: 90,
    height: 14
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
    <div className={classes.wrapper}>
      <div className={classes.inner} />
    </div>
  )
}

export default BannerSizeMock
