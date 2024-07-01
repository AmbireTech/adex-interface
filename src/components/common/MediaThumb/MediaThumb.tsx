import { useCallback, useMemo, useState } from 'react'
import { Box, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
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
  const { classes } = useStyles({ width, height })

  const handleOnClick = useCallback(() => previewOnClick && setModalOpened(true), [previewOnClick])

  const boxOptions = useMemo(
    () => ({
      className: classes.thumbContainer,
      onClick: previewOnClick ? handleOnClick : undefined,
      onMouseEnter: previewOnClick ? undefined : () => setModalOpened(true),
      onMouseLeave: previewOnClick ? undefined : () => setModalOpened(false)
    }),
    [classes.thumbContainer, handleOnClick, previewOnClick]
  )

  return (
    <>
      <Box {...boxOptions}>
        <Media adUnit={adUnit} width={width} height={height} />
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
