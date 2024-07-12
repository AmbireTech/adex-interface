import { PropsWithChildren } from 'react'
import { Button, Flex, Group, Loader, Modal } from '@mantine/core'
import { createStyles } from '@mantine/emotion'

type DetailsProps = PropsWithChildren & {
  title: string
  loading: boolean
  opened: boolean
  close: () => void
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: '1px solid',
    borderRadius: theme.radius.sm,
    borderColor: theme.colors.decorativeBorders[3]
    // padding: theme.spacing.lg
  },
  header: {
    backgroundColor: theme.colors.lightBackground[3],
    padding: theme.spacing.xl
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.other.fontWeights.bold
  },
  close: {
    color: theme.colors.mainText[3]
  },
  printable: {
    [theme.other.media.print]: {
      // NOTE: it's not fixed/absolute to body but modal.inner
      overflow: 'visible',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '100%'
      // padding: theme.spacing.xl
    }
  }
}))

export const BillingDetailsModal = ({ children, loading, title, opened, close }: DetailsProps) => {
  const { classes } = useStyles()
  return (
    <Modal
      title={title}
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
        {loading ? (
          <Flex justify="center" align="center" h="60vh">
            <Loader size="xl" />
          </Flex>
        ) : (
          <>
            <Group justify="right">
              <Button mt="md" mb="md" onClick={() => window.print()}>
                Print
              </Button>
            </Group>

            <div className={classes.wrapper}>
              <div id="printable" className={classes.printable}>
                {children}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
