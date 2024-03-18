import { Image, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { getMediaUrlWithProvider, isVideoMedia } from 'helpers/createCampaignHelpers'
import { useMemo } from 'react'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useStyles = createStyles(() => ({
  image: {
    maxWidth: 40,
    maxHeight: 40
  },
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
        <iframe
          title="htmlBanner"
          width={40}
          height={40}
          // src={mediaUrl}
          src="https://gateway.pinata.cloud/ipfs/QmW7S5HRLkP4XtPNyT1vQSjP3eRdtZaVtF6FAPvUfduMjA"
        />
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

  return <Image src={mediaUrlWithProvider} alt={title} className={classes.image} />
}

export default MediaBanner
