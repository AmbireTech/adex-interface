import { Modal } from '@mantine/core'
import { AdUnit } from 'adex-common'
import Media from 'components/common/Media'

const CreativePreviewModal = ({
  media,
  opened,
  close
}: {
  media: AdUnit
  opened: boolean
  close: () => void
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      withCloseButton={false}
      withOverlay={false}
      size="auto"
    >
      <Media adUnit={media} width={media.banner?.format.w} height={media.banner?.format.h} />
    </Modal>
  )
}

export default CreativePreviewModal
