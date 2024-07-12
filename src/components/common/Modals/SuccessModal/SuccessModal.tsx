import { Modal, Flex, Button, createStyles } from '@mantine/core'
import Lottie from 'lottie-react'
import { ReactNode } from 'react'
import AnimationData from 'resources/lotties/success-lottie.json'

type SuccessModalProps = {
  text: ReactNode
  opened: boolean
  close: () => void
}
const useStyles = createStyles((theme) => ({
  wrapper: {
    background:
      theme.colors.success[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest
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
          {text}
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
