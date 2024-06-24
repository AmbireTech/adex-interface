import { Button, ButtonProps } from '@mantine/core'
// import { modals } from '@mantine/modals'
import { PropsWithChildren, useCallback, useState } from 'react'
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal'

type ConfirmModalProps = ButtonProps &
  PropsWithChildren & {
    title?: string
    btnLabel: string
    cancelBtnLabel?: string
    confirmBtnLabel?: string
    onCancelClicked: () => void
    onConfirmClicked: () => void
  }

const LaunchCampaignModal = ({
  btnLabel,
  cancelBtnLabel = 'Cancel',
  confirmBtnLabel = 'Confirm',
  children,
  onCancelClicked,
  onConfirmClicked,
  ...rest
}: ConfirmModalProps) => {
  const [open, setOpen] = useState(false)

  const updateOpenState = useCallback(() => setOpen((prev) => !prev), [])

  return (
    <>
      <Button onClick={updateOpenState} {...rest}>
        {btnLabel}
      </Button>
      <CustomConfirmModal
        cancelBtnLabel={cancelBtnLabel}
        confirmBtnLabel={confirmBtnLabel}
        onCancelClicked={onCancelClicked}
        onConfirmClicked={onConfirmClicked}
        color="attention"
        text="Once you click on 'Launch campaign' any further edits to the campaign will be
        disabled. Are you certain you wish to proceed with the launch?"
        opened={open}
      />
    </>
  )
}
export default LaunchCampaignModal
