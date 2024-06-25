import { useEffect, useState } from 'react'
import { createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { useHover } from '@mantine/hooks'
import { CreativePreviewModal } from '../Modals'
import Media from '../Media'

const useStyles = createStyles((theme) => ({
  thumbContainer: {
    position: 'relative',
    maxWidth: 40,
    maxHeight: 40,
    overflow: 'hidden',
    background: theme.colors.alternativeBackground[theme.fn.primaryShade()],
    '&:hover': {
      cursor: 'pointer'
    }
  }
}))

const MediaThumb = ({ adUnit }: { adUnit: AdUnit }) => {
  const { hovered, ref } = useHover()
  const [modalOpened, setModalOpened] = useState(false)
  const { classes } = useStyles()

  useEffect(() => {
    setModalOpened(hovered)
  }, [hovered])

  return (
    <>
      <div ref={ref} className={classes.thumbContainer}>
        <Media adUnit={adUnit} />
      </div>
      <CreativePreviewModal
        media={adUnit}
        opened={modalOpened}
        close={() => setModalOpened(false)}
      />
    </>
  )
}

export default MediaThumb
