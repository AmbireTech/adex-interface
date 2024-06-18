import { useCallback, useState } from 'react'
import { UnstyledButton, Group, Text, createStyles, Flex, Modal, Button } from '@mantine/core'
import { Link, LinkProps } from 'react-router-dom'
import AttentionIcon from 'resources/icons/Attention'

const useStyles = createStyles((theme) => ({
  button: {
    display: 'block',
    width: '100%',
    height: '100%',
    padding: theme.spacing.xs,
    borderRadius: 'none',
    position: 'relative',
    color: theme.fn.lighten(
      theme.colors.mainText[theme.fn.primaryShade()],
      theme.other.shades.lighten.lighter
    ),
    '&:hover': {
      background: theme.colors.lightBackground[theme.fn.primaryShade()]
    }
  },
  active: {
    // backgroundColor: theme.fn.primaryColor() + theme.other.shades.hexColorSuffix.lightest,
    color: theme.fn.primaryColor(),
    fontWeight: theme.other.fontWeights.regular,
    opacity: 1,
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 5,
      backgroundColor: theme.fn.primaryColor()
    }
  },
  icon: {
    height: 26,
    width: 26,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing.xs
  },
  confirmModalContent: {
    background:
      theme.colors.attention[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest,
    padding: theme.spacing.xl
  },
  iconWrapper: {
    width: 50,
    height: 50,
    background: `${theme.colors.attention[theme.fn.primaryShade()]}1A`,
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

type NavLinkProps = LinkProps & {
  to?: string
  icon?: React.ReactNode
  label: string
  action?: () => void
  active?: boolean
  hasConfirmModal?: boolean
}

function NavLink({ to = '', icon, label, action, active, hasConfirmModal, ...rest }: NavLinkProps) {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)

  const handleModalClicked = useCallback(() => setOpened((prev) => !prev), [])

  return hasConfirmModal ? (
    <>
      <UnstyledButton className={classes.button} onClick={handleModalClicked} px="xl">
        <Group>
          <span className={classes.icon}>{icon}</span>
          <Text size="md">{label}</Text>
        </Group>
      </UnstyledButton>
      <Modal
        opened={opened}
        onClose={handleModalClicked}
        withCloseButton={false}
        classNames={{
          body: classes.root
        }}
      >
        <Flex justify="center" className={classes.confirmModalContent}>
          <div className={classes.iconWrapper}>
            <AttentionIcon className={classes.attentionIcon} />
          </div>
          <Text>
            To add funds to your account, please contact us at{' '}
            <a href="mailto: contactus@adex.network"> contactus@adex.network</a> and send us you
            account ID (the address which you can find in the upper right corner of your profile).
            We will provide you with further instructions on how to deposit funds on the address.
          </Text>
        </Flex>
        <Flex justify="space-between" p="xl">
          <Button size="lg" variant="outline" onClick={handleModalClicked}>
            Go back
          </Button>
          <Button
            size="lg"
            onClick={() => {
              window.location.href = 'mailto:contactus@adex.network'
              handleModalClicked()
            }}
          >
            Contact us
          </Button>
        </Flex>
      </Modal>
    </>
  ) : (
    <UnstyledButton
      to={to}
      component={Link}
      title={label}
      onClick={action}
      className={cx(classes.button, { [classes.active]: active })}
      px="xl"
      {...rest}
    >
      <Group>
        <span className={classes.icon}>{icon}</span>
        <Text size="md">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

export default NavLink
