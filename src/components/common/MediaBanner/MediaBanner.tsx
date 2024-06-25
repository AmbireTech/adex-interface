import { Image, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { getMediaUrlWithProvider, isVideoMedia } from 'helpers/createCampaignHelpers'
import { useMemo } from 'react'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY
const SCALE_VALUE = 4

const useStyles = createStyles(
  (
    theme,
    {
      zoomOnHover,
      width,
      height
    }: { zoomOnHover: boolean | undefined; width?: number | string; height?: number | string }
  ) => ({
    container: {
      position: 'relative',
      maxWidth: width,
      maxHeight: height,
      overflow: 'hidden',
      transition: zoomOnHover ? 'transform 0.3s ease-in-out' : 'none',
      background: theme.colors.alternativeBackground[theme.fn.primaryShade()],
      '&:hover': {
        zIndex: zoomOnHover ? 9999 : 'auto',
        transform: zoomOnHover ? `scale(${SCALE_VALUE})` : 'none',
        border: zoomOnHover ? '0.5px solid' : 'none',
        borderColor: zoomOnHover ? theme.colors.decorativeBorders[theme.fn.primaryShade()] : 'none',
        borderRadius: zoomOnHover ? theme.radius.xs : 'none'
      }
    }
  })
)

// TODO: Rename it to Media and remove on hover event

const MediaBanner = ({
  adUnit,
  zoomOnHover,
  width = 40,
  height = 40
}: {
  adUnit: AdUnit
  zoomOnHover?: boolean
  width?: number | string
  height?: number | string
}) => {
  const { classes } = useStyles({ zoomOnHover, width, height })

  if (!adUnit.banner) {
    return null
  }

  const {
    title,
    banner: { mediaUrl, mime }
  } = adUnit

  if (!mediaUrl || !mime) {
    return null
  }

  const mediaUrlWithProvider = useMemo(
    () => getMediaUrlWithProvider(mediaUrl, IPFS_GATEWAY),
    [mediaUrl]
  )

  if (mime === 'text/html') {
    return (
      <div className={classes.container}>
        <iframe id={title} title={title} src={mediaUrlWithProvider} width={width} height={height} />
      </div>
    )
  }

  if (isVideoMedia(mime)) {
    return (
      <div className={classes.container}>
        <video width={width} height={height} autoPlay loop>
          <source src={mediaUrlWithProvider} type="video/mp4" />
          <track src="captions_en.vtt" kind="captions" label="english_captions" />
        </video>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <Image src={mediaUrlWithProvider} alt={title} width={width} height={height} />
    </div>
  )
}

export default MediaBanner
