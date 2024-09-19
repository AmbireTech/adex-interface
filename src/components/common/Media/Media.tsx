import { Center, Image, Loader } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { getMediaUrlWithProvider, isVideoMedia } from 'helpers/createCampaignHelpers'
import { useMemo, useState } from 'react'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

type MimeType = 'html' | 'image' | 'video'

const Media = ({
  adUnit,
  width = 40,
  height = 40,
  disableEventPopping
}: {
  adUnit: AdUnit
  width?: number | string
  height?: number | string
  disableEventPopping?: boolean
}) => {
  // const { classes } = useStyles({ width, height })
  const [loading, setLoading] = useState(true)

  if (!adUnit.banner) {
    return null
  }

  const {
    title,
    banner: { mediaUrl, mime }
  } = adUnit

  const type: MimeType = useMemo<MimeType>((): MimeType => {
    let mimeType: MimeType = 'image'

    if (mime === 'text/html') {
      mimeType = 'html'
    } else if (isVideoMedia(mime)) {
      mimeType = 'video'
    }

    return mimeType
  }, [mime])

  if (!mediaUrl || !mime) {
    return null
  }

  const mediaUrlWithProvider = useMemo(
    () => getMediaUrlWithProvider(mediaUrl, IPFS_GATEWAY),
    [mediaUrl]
  )

  return (
    <Center
      w={width}
      h={height}
      style={{
        overflow: 'hidden',
        pointerEvents: disableEventPopping ? 'none' : undefined
      }}
    >
      {type === 'video' && (
        <video width={width} height={height} autoPlay loop>
          <source src={mediaUrlWithProvider} type="video/mp4" />
          <track src="captions_en.vtt" kind="captions" label="english_captions" />
        </video>
      )}

      {type !== 'video' && loading && <Loader type="dots" />}

      {type === 'html' && (
        <iframe
          hidden={loading}
          id={title}
          title={title}
          src={mediaUrlWithProvider}
          width={adUnit.banner.format.w}
          height={adUnit.banner.format.h}
          style={{ border: 0 }}
          onLoad={() => setLoading(false)}
        />
      )}

      {type === 'image' && (
        <Image
          hidden={loading}
          src={mediaUrlWithProvider}
          alt={title}
          width={width}
          height={height}
          onLoad={() => setLoading(false)}
        />
      )}
    </Center>
  )
}

export default Media
