import { PropsWithChildren, useEffect, useCallback, useMemo } from 'react'
import {
  Button,
  Center,
  Group,
  Loader,
  MantineTheme,
  Modal,
  getPrimaryShade,
  ScrollArea,
  Portal,
  Box
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'

type DetailsProps = PropsWithChildren & {
  title: string
  documentTitle: string
  loading: boolean
  opened: boolean
  close: () => void
  closeAfterPrint?: boolean
}

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    wrapper: {
      border: '1px solid',
      borderRadius: theme.radius.sm,
      borderColor: theme.colors.decorativeBorders[primaryShade]
      // padding: theme.spacing.lg
    },
    header: {
      backgroundColor: theme.colors.lightBackground[primaryShade],
      padding: theme.spacing.xl
    },
    title: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.other.fontWeights.bold
    },
    close: {
      color: theme.colors.mainText[primaryShade]
    },
    printableModal: {
      [theme.other.media.print]: {
        display: 'none'
      }
    },
    printable: {
      display: 'none',
      [theme.other.media.print]: {
        // border: '1px solid yellow',
        display: 'block'
      }
    }
  }
})

export const BillingDetailsModal = ({
  children,
  loading,
  title,
  documentTitle,
  opened,
  close,
  closeAfterPrint
}: DetailsProps) => {
  const { classes } = useStyles()
  const originalTitle = useMemo(() => {
    return window.document.title
  }, [])

  useEffect(() => {
    window.addEventListener('beforeprint', () => {
      window.document.title = documentTitle
    })

    window.addEventListener('afterprint', () => {
      window.document.title = originalTitle

      if (closeAfterPrint) {
        close()
      }
    })

    return () => {
      window.removeEventListener('beforeprint', () => {
        window.document.title = documentTitle
      })

      window.removeEventListener('afterprint', () => {
        window.document.title = originalTitle

        if (closeAfterPrint) {
          close()
        }
      })
    }
  }, [close, closeAfterPrint, documentTitle, originalTitle])

  const print = useCallback(() => {
    window.print()
  }, [])

  return (
    <>
      <Modal
        className={classes.printableModal}
        title={
          <Group>
            <Button mt="md" mb="md" onClick={print}>
              Print
            </Button>
            {title}
          </Group>
        }
        size="xl"
        opened={opened}
        onClose={close}
        centered
        radius="sm"
        padding="md"
        classNames={{
          header: classes.header,
          title: classes.title,
          close: classes.close
        }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {loading ? (
          <Center h="100%">
            <Loader size="xl" />
          </Center>
        ) : (
          <Box p="sm"> {children}</Box>
        )}
      </Modal>
      <Portal>
        <Box id="printable" className={classes.printable}>
          {children}
        </Box>
      </Portal>
    </>
  )
}
