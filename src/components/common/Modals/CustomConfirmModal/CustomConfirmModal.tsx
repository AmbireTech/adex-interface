import { Button, ButtonProps, Flex, MantineColor, Modal, Text, createStyles } from '@mantine/core'
import { PropsWithChildren } from 'react'
import AttentionIcon from 'resources/icons/Attention'

const useStyles = createStyles((theme, { color }: { color: MantineColor }) => ({
  confirmModalContent: {
    background:
      theme.colors[color][theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest,
    padding: theme.spacing.xl
  },
  iconWrapper: {
    width: 50,
    height: 50,
    background: `${theme.colors[color][theme.fn.primaryShade()]}1A`,
    borderRadius: '50%',
    padding: theme.spacing.sm
  },
  attentionIcon: {
    width: 25,
    height: 25,
    color: theme.colors.attention[theme.fn.primaryShade()]
  },
  root: {
    padding: 0
  }
}))

type ConfirmModalProps = ButtonProps &
  PropsWithChildren & {
    title?: string
    cancelBtnLabel?: string
    confirmBtnLabel?: string
    onCancelClicked: () => void
    onConfirmClicked: () => void
    color?: MantineColor
    text: string
    opened: boolean
  }

const CustomConfirmModal = ({
  title,
  cancelBtnLabel = 'Cancel',
  confirmBtnLabel = 'Confirm',
  onCancelClicked,
  onConfirmClicked,
  color = 'attention',
  text,
  opened = false,
  ...rest
}: ConfirmModalProps) => {
  const { classes } = useStyles({ color })

  return (
    <Modal
      title={title}
      opened={opened}
      onClose={onCancelClicked}
      closeOnClickOutside={false}
      withCloseButton={false}
      classNames={{
        body: classes.root
      }}
      {...rest}
    >
      <Flex justify="center" className={classes.confirmModalContent}>
        <div className={classes.iconWrapper}>
          {/* TODO: icon should be passed as a prop */}
          <AttentionIcon className={classes.attentionIcon} />
        </div>
        <Text w="100%">{text}</Text>
      </Flex>
      <Flex justify="space-between" p="xl">
        <Button size="lg" variant="outline" onClick={onCancelClicked}>
          {cancelBtnLabel}
        </Button>
        <Button size="lg" onClick={onConfirmClicked}>
          {confirmBtnLabel}
        </Button>
      </Flex>
    </Modal>
  )
}
export default CustomConfirmModal
