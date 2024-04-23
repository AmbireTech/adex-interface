import { Image, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { getMediaUrlWithProvider, isVideoMedia } from 'helpers/createCampaignHelpers'
import { useMemo } from 'react'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useStyles = createStyles(() => ({
  imageContainer: {
    maxWidth: 40,
    maxHeight: 40,
    overflow: 'hidden'
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
      <div className={classes.imageContainer}>
        <iframe id={title} title={title} src={mediaUrlWithProvider} width={40} height={40} />
      </div>
    )
  }

  if (isVideoMedia(mime)) {
    return (
      <video width="40" height="40" autoPlay loop>
        <source src={mediaUrlWithProvider} type="video/mp4" />
        <track src="captions_en.vtt" kind="captions" label="english_captions" />
      </video>
    )
  }

  return <Image src={mediaUrlWithProvider} alt={title} height={40} width={40} />
}

export default MediaBanner
