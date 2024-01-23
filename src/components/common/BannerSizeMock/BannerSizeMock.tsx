import { Flex, createStyles, Text } from '@mantine/core'
import { BannerVariantNew } from 'types'

const useStyles = createStyles(
  (theme, { variant, active }: { variant: BannerVariantNew; active: boolean }) => ({
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
    },
    inner: {
      width: variant.width,
      height: variant.height,
      backgroundColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
      borderRadius: theme.radius.xs
    }
  })
)

const BannerSizeMock = ({ variant }: { variant: BannerVariantNew }) => {
  const { classes } = useStyles({ variant, active: !!variant.checked })
  return (
    <Flex direction="column" align="center">
      <div className={classes.wrapper}>
        <div className={classes.inner} />
      </div>
      <Text size="sm">{`${variant.bannerSizes.w} x ${variant.bannerSizes.h}`}</Text>
    </Flex>
  )
}

export default BannerSizeMock
