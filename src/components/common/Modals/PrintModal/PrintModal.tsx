import { Button, Group, Modal, createStyles } from '@mantine/core'
// import { useDisclosure } from '@mantine/hooks'
import InvoicesPDF from 'components/common/CustomTable/InvoicesPDF'

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: '1px solid',
    borderRadius: theme.radius.sm,
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    padding: theme.spacing.lg
  },
  header: {
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    padding: theme.spacing.xl
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.other.fontWeights.bold
  },
  close: {
    color: theme.colors.mainText[theme.fn.primaryShade()]
  },
  printable: {
    [theme.other.media.print]: {
      // NOTE: it's not fixed/absolute to body but modal.inner
      overflow: 'visible',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '100%',
      padding: theme.spacing.xl
    }
  }
}))

const PrintModal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const { classes } = useStyles()
  return (
    <Modal
      title="Invoice"
      size="xl"
      opened={opened}
      onClose={close}
      centered
      radius="sm"
      classNames={{
        header: classes.header,
        title: classes.title,
        close: classes.close
      }}
    >
      <div>
        <Group position="right">
          <Button mt="md" mb="md" onClick={() => window.print()}>
            Print
          </Button>
        </Group>
        <div className={classes.wrapper}>
          <div id="printable" className={classes.printable}>
            {/* TODO: Remove InvoicesPDF */}
            <InvoicesPDF />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PrintModal
