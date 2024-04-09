import { Button, ButtonProps } from '@mantine/core'
import { modals } from '@mantine/modals'
import { PropsWithChildren, useCallback } from 'react'

type ConfirmModalProps = ButtonProps &
  PropsWithChildren & {
    title?: string
    btnLabel: string
    cancelBtnLabel?: string
    confirmBtnLabel?: string
    onCancelClicked: () => void
    onConfirmClicked: () => void
  }

const ConfirmModal = ({
  title,
  btnLabel,
  cancelBtnLabel = 'Cancel',
  confirmBtnLabel = 'Confirm',
  children,
  onCancelClicked,
  onConfirmClicked,
  ...rest
}: ConfirmModalProps) => {
  const openModal = useCallback(
    () =>
      modals.openConfirmModal({
        title,
        children,
        labels: { confirm: confirmBtnLabel, cancel: cancelBtnLabel },
        onCancel: onCancelClicked,
        onConfirm: onConfirmClicked
      }),
    [title, cancelBtnLabel, confirmBtnLabel, children, onCancelClicked, onConfirmClicked]
  )

  return (
    <Button onClick={openModal} {...rest}>
      {btnLabel}
    </Button>
  )
}
export default ConfirmModal
