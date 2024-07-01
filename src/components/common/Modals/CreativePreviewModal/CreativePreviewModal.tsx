import { Modal, Flex, Text } from '@mantine/core'
import { AdUnit } from 'adex-common'
import Media from 'components/common/Media'

const CreativePreviewModal = ({
  hasCloseBtn,
  media,
  opened,
  title,
  close
}: {
  hasCloseBtn: boolean
  media: AdUnit
  opened: boolean
  title?: string
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
      <Flex direction="column" align="center" justify="center" gap="sm">
        <Text>{title}</Text>
        <Media adUnit={media} width={media.banner?.format.w} height={media.banner?.format.h} />
        <Text>{media.banner?.mediaUrl}</Text>
      </Flex>
    </Modal>
  )
}

export default CreativePreviewModal
