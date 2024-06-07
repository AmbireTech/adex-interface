import { Image, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { getMediaUrlWithProvider, isVideoMedia } from 'helpers/createCampaignHelpers'
import { useMemo } from 'react'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useStyles = createStyles(() => ({
  container: {
    maxWidth: 40,
    maxHeight: 40,
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      // TODO: fix the scale value
      transform: 'scale(3.1)'
    }
  }
}))

const MediaBanner = ({ adUnit }: { adUnit: AdUnit }) => {
  const { classes } = useStyles()

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
