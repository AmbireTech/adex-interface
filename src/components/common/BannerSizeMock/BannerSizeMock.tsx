import { Flex, createStyles, Text } from '@mantine/core'
import { BANNER_VARIANTS } from 'constants/banners'
import { ShapeVariants } from 'types'

const useStyles = createStyles(
  (theme, { variant, active }: { variant: ShapeVariants; active: boolean }) => ({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 112,
      height: 96,
      background: theme.colors.lightBackground[theme.fn.primaryShade()],
      border: '1px solid',
      borderColor: active ? 'blue' : theme.colors.decorativeBorders[theme.fn.primaryShade()],
      // boxShadow: theme.shadows.sm,
      borderRadius: theme.radius.sm
    },
    inner: {
      width: BANNER_VARIANTS[variant].width,
      height: BANNER_VARIANTS[variant].height,
      backgroundColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
      borderRadius: theme.radius.xs
    }
  })
)

const BannerSizeMock = ({
  variant,
  active
}: {
  variant: ShapeVariants
  active: boolean | undefined
}) => {
  const { classes } = useStyles({ variant, active: !!active })
  return (
    <Flex direction="column" align="center">
      <div className={classes.wrapper}>
        <div className={classes.inner} />
        {/* <Text size="sm" style={{ position: 'absolute' }}>
          {variants[variant].bannerSizes}
        </Text> */}
      </div>
      <Text size="sm">{BANNER_VARIANTS[variant].bannerSizes}</Text>
      {/* <Text size="sm">{variants[variant].bannerName}</Text> */}
    </Flex>
  )
}

export default BannerSizeMock
