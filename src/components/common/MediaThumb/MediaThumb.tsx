import { useEffect, useState } from 'react'
import { Modal, createStyles } from '@mantine/core'
import { AdUnit } from 'adex-common/dist/types'
import { useHover } from '@mantine/hooks'
import MediaBanner from '../MediaBanner'

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
  },
  modalContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
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
        <MediaBanner adUnit={adUnit} />
      </div>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
        withCloseButton={false}
        withOverlay={false}
        size="auto"
      >
        <div className={classes.modalContent}>
          <MediaBanner
            adUnit={adUnit}
            width={adUnit.banner?.format.w}
            height={adUnit.banner?.format.h}
          />
        </div>
      </Modal>
    </>
  )
}

export default MediaThumb
