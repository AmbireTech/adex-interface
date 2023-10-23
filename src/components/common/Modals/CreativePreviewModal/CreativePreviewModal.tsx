import { Modal, Image, createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  header: {
    marginTop: theme.spacing.lg
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.other.fontWeights.bold
  },
  close: {
    color: theme.colors.mainText[theme.fn.primaryShade()]
  }
}))

const CreativePreviewModal = ({
  media,
  opened,
  close
}: {
  media: string
  opened: boolean
  close: () => void
}) => {
  const { classes } = useStyles()
  return (
    <Modal
      size="lg"
      centered
      //   padding="xl"
      opened={opened}
      onClose={close}
      classNames={{
        header: classes.header,
        title: classes.title,
        close: classes.close
      }}
    >
      <Image src={media} pt="xl" pb="xl" />
    </Modal>
  )
}

export default CreativePreviewModal
