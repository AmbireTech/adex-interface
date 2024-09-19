import { useCallback, useMemo, useState } from 'react'
import { Box } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { CreativePreviewModal } from '../Modals'
import Media from '../Media'

const MediaThumb = ({
  adUnit,
  previewOnClick,
  width = 40,
  height = 40,
  title
}: {
  adUnit: AdUnit
  previewOnClick?: boolean
  width?: number | string
  height?: number | string
  title?: string
}) => {
  const [modalOpened, setModalOpened] = useState(false)

  const handleOnClick = useCallback(() => previewOnClick && setModalOpened(true), [previewOnClick])

  const boxOptions = useMemo(
    () => ({
      onClick: previewOnClick ? handleOnClick : undefined,
      onMouseEnter: previewOnClick ? undefined : () => setModalOpened(true),
      onMouseLeave: previewOnClick ? undefined : () => setModalOpened(false)
    }),
    [handleOnClick, previewOnClick]
  )

  return (
    <>
      <Box w={width} h={height} {...boxOptions} style={{ cursor: 'pointer' }}>
        <Media adUnit={adUnit} width={width} height={height} disableEventPopping />
      </Box>
      <CreativePreviewModal
        hasCloseBtn={!!previewOnClick}
        media={adUnit}
        opened={modalOpened}
        close={() => setModalOpened(false)}
        title={title}
      />
    </>
  )
}

export default MediaThumb
