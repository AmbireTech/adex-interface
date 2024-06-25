import { Image, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { getMediaUrlWithProvider, isVideoMedia } from 'helpers/createCampaignHelpers'
import { useMemo } from 'react'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY
const SCALE_VALUE = 4

const useStyles = createStyles((theme, { zoomOnHover }: { zoomOnHover: boolean | undefined }) => ({
  container: {
    position: 'relative',
    maxWidth: 40,
    maxHeight: 40,
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
}))

const MediaBanner = ({ adUnit, zoomOnHover }: { adUnit: AdUnit; zoomOnHover?: boolean }) => {
  const { classes } = useStyles({ zoomOnHover })

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
        <iframe id={title} title={title} src={mediaUrlWithProvider} width={40} height={40} />
      </div>
    )
  }

  if (isVideoMedia(mime)) {
    return (
      <div className={classes.container}>
        <video width="40" height="40" autoPlay loop>
          <source src={mediaUrlWithProvider} type="video/mp4" />
          <track src="captions_en.vtt" kind="captions" label="english_captions" />
        </video>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <Image src={mediaUrlWithProvider} alt={title} height={40} width={40} />
    </div>
  )
}

export default MediaBanner
