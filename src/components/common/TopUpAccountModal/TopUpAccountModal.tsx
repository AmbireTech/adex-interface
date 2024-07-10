import { Link } from 'react-router-dom'
import { Text } from '@mantine/core'
import { CustomConfirmModal } from '../Modals'

const TopUpAccountModal = ({
  opened,
  onCancelClicked,
  onConfirmClicked
}: {
  opened: boolean
  onCancelClicked: () => void
  onConfirmClicked: () => void
}) => {
  return (
    <CustomConfirmModal
      cancelBtnLabel="Close"
      confirmBtnLabel="Get in touch"
      onCancelClicked={onCancelClicked}
      onConfirmClicked={onConfirmClicked}
      color="attention"
      text={
        <Text>
          To add funds to your account, please contact us at{' '}
          <a href="mailto: contactus@adex.network" target="_blank" rel="noreferrer">
            contactus@adex.network
          </a>{' '}
          and send us you account ID (the address which you can find in the upper right corner of
          your profile), company name and country of registration. We will provide you with further
          instructions on how to deposit funds on the address.
        </Text>
      }
      opened={opened}
      confirmBtnProps={{
        component: Link,
        target: '_blank',
        rel: 'noreferrer',
        to: 'mailto: contactus@adex.network',
        size: 'lg'
      }}
      overlayTop
    />
  )
}

export default TopUpAccountModal
