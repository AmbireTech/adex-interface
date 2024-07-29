import { Flex, Text, createStyles } from '@mantine/core'
import ActionButton from 'components/common/CustomTable/ActionButton/ActionButton'
import LeftChevronIcon from 'resources/icons/LeftChevron'
import { useNavigate } from 'react-router-dom'
import { SIDE_BAR_WIDTH } from 'themes/base'
import { PropsWithChildren } from 'react'

const useStyles = createStyles((theme) => ({
  sticky: {
    position: 'fixed',
    top: 90,
    left: SIDE_BAR_WIDTH,
    width: `calc(100% - ${SIDE_BAR_WIDTH}px)`,
    zIndex: 10,
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    [theme.fn.smallerThan('sm')]: {
      left: 0,
      width: '100%'
    }
  }
}))

const GoBack = ({
  title,
  fixed,
  children
}: { title: string; fixed?: boolean } & PropsWithChildren) => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const handleClick = () => navigate(-1)

  return (
    <Flex align="center" className={cx({ [classes.sticky]: !!fixed })}>
      <ActionButton action={handleClick} icon={<LeftChevronIcon />} title={title}>
        <Text weight="bold" size="sm">
          {title}
        </Text>
      </ActionButton>
      {children}
    </Flex>
  )
}

export default GoBack
