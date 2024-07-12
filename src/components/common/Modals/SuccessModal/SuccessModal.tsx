import { Text, Modal, Flex, Button } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import Lottie from 'lottie-react'
import AnimationData from 'resources/lotties/success-lottie.json'

type SuccessModalProps = {
  text: string
  opened: boolean
  close: () => void
}
const useStyles = createStyles((theme) => ({
  wrapper: {
    background: theme.colors.success[3] + theme.other.shades.hexColorSuffix.lightest
  },
  root: {
    padding: 0
  }
}))

const SuccessModal = ({ text, opened, close }: SuccessModalProps) => {
  const { classes } = useStyles()
  return (
    <Modal
      size="md"
      withCloseButton={false}
      opened={opened}
      onClose={close}
      classNames={{
        body: classes.root
      }}
    >
      <>
        <Flex direction="row" justify="center" className={classes.wrapper}>
          <Lottie animationData={AnimationData} loop={false} autoplay />
          <Text p="md">{text}</Text>
        </Flex>
        <Flex gap={25} justify="center" m="xl">
          <Button onClick={close} color="brand" variant="outline" size="lg">
            Close
          </Button>
        </Flex>
      </>
    </Modal>
  )
}
export default SuccessModal
