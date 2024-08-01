import {
  Button,
  ButtonProps,
  Flex,
  MantineColor,
  MantineTheme,
  Modal,
  Text,
  getPrimaryShade,
  lighten
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import Lottie from 'lottie-react'
import { PropsWithChildren } from 'react'
import { LinkProps } from 'react-router-dom'
import AttentionIcon from 'resources/icons/Attention'
import AnimationData from 'resources/lotties/Arrow-up-data.json'

const useStyles = createStyles(
  (
    theme: MantineTheme,
    { color, overlayTop }: { color: MantineColor; overlayTop: boolean | undefined }
  ) => {
    const colorScheme = useColorScheme()
    const primaryShade = getPrimaryShade(theme, colorScheme)

    return {
      confirmModalContent: {
        background: lighten(theme.colors[color][primaryShade], theme.other.shades.lighten.lightest),
        padding: theme.spacing.xl
      },
      iconWrapper: {
        width: 50,
        height: 50,
        background: `${theme.colors[color][primaryShade]}1A`,
        borderRadius: '50%',
        padding: theme.spacing.sm
      },
      attentionIcon: {
        width: 25,
        height: 25,
        color: theme.colors.attention[primaryShade]
      },
      root: {
        padding: 0
      },
      overlay: {
        marginTop: overlayTop ? 90 : undefined
      },
      lottie: {
        zIndex: 9999,
        width: 100,
        height: 100,
        position: 'absolute',
        top: 95,
        right: 180,
        transform: 'rotate(180deg)'
      }
    }
  }
)

type ConfirmModalProps = ButtonProps &
  PropsWithChildren & {
    title?: string
    cancelBtnLabel?: string
    confirmBtnLabel?: string
    onCancelClicked: () => void
    onConfirmClicked: () => void
    confirmBtnProps?: ButtonProps &
      LinkProps & {
        component?: any
      }
    color?: MantineColor
    text: string | React.ReactNode
    opened: boolean
    overlayTop?: boolean
  }

const CustomConfirmModal = ({
  title,
  cancelBtnLabel = 'Cancel',
  confirmBtnLabel = 'Confirm',
  onCancelClicked,
  onConfirmClicked,
  confirmBtnProps,
  color = 'attention',
  text,
  opened = false,
  overlayTop
}: ConfirmModalProps) => {
  const { classes } = useStyles({ color, overlayTop })

  return (
    <>
      {overlayTop && opened ? (
        <Lottie animationData={AnimationData} loop autoplay className={classes.lottie} />
      ) : null}
      <Modal
        title={title}
        opened={opened}
        onClose={onCancelClicked}
        closeOnClickOutside={false}
        withCloseButton={false}
        classNames={{
          body: classes.root,
          overlay: classes.overlay
        }}
        centered
      >
        <Flex justify="center" className={classes.confirmModalContent}>
          <div className={classes.iconWrapper}>
            {/* TODO: icon should be passed as a prop */}
            <AttentionIcon className={classes.attentionIcon} />
          </div>
          <Text w="100%" pt="xl">
            {text}
          </Text>
        </Flex>
        <Flex justify="space-between" p="xl">
          <Button size="lg" variant="outline" onClick={onCancelClicked}>
            {cancelBtnLabel}
          </Button>
          <Button size="lg" onClick={onConfirmClicked} {...confirmBtnProps}>
            {confirmBtnLabel}
          </Button>
        </Flex>
      </Modal>
    </>
  )
}
export default CustomConfirmModal
