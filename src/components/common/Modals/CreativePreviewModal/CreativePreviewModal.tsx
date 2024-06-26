import { Modal } from '@mantine/core'
import { AdUnit } from 'adex-common'
import Media from 'components/common/Media'

const CreativePreviewModal = ({
  hasCloseBtn,
  media,
  opened,
  close
}: {
  hasCloseBtn: boolean
  media: AdUnit
  opened: boolean
  close: () => void
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      withCloseButton={hasCloseBtn}
      withOverlay={hasCloseBtn}
      size="auto"
    >
      <Media adUnit={media} width={media.banner?.format.w} height={media.banner?.format.h} />
    </Modal>
  )
}

export default CreativePreviewModal
