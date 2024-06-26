import { useCallback, useEffect, useState } from 'react'
import { Box, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { useHover } from '@mantine/hooks'
import { CreativePreviewModal } from '../Modals'
import Media from '../Media'

const useStyles = createStyles(
  (theme, { width, height }: { width?: number | string; height?: number | string }) => ({
    thumbContainer: {
      position: 'relative',
      maxWidth: width,
      maxHeight: height,
      overflow: 'hidden',
      background: theme.colors.alternativeBackground[theme.fn.primaryShade()],
      '&:hover': {
        cursor: 'pointer'
      }
    }
  })
)

const MediaThumb = ({
  adUnit,
  previewOnClick,
  width = 40,
  height = 40
}: {
  adUnit: AdUnit
  previewOnClick?: boolean | undefined
  width?: number | string
  height?: number | string
}) => {
  const { hovered, ref } = useHover()
  const [modalOpened, setModalOpened] = useState(false)
  const { classes } = useStyles({ width, height })

  useEffect(() => {
    if (!previewOnClick) setModalOpened(hovered)
  }, [hovered, previewOnClick])

  const handleOnClick = useCallback(
    () => !!previewOnClick && setModalOpened(true),
    [previewOnClick]
  )

  return (
    <>
      <Box ref={ref} className={classes.thumbContainer} onClick={handleOnClick}>
        <Media adUnit={adUnit} width={width} height={height} />
      </Box>
      <CreativePreviewModal
        hasCloseBtn={previewOnClick}
        media={adUnit}
        opened={modalOpened}
        close={() => setModalOpened(false)}
      />
    </>
  )
}

export default MediaThumb
