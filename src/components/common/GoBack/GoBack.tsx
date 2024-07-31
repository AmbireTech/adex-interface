import { MantineTheme, Text, getPrimaryShade, Flex } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import ActionButton from 'components/common/CustomTable/ActionButton/ActionButton'
import LeftChevronIcon from 'resources/icons/LeftChevron'
import { useNavigate } from 'react-router-dom'
import { SIDE_BAR_WIDTH } from 'themes/base'
import { PropsWithChildren } from 'react'
import { useColorScheme } from '@mantine/hooks'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    sticky: {
      position: 'fixed',
      top: 90,
      left: SIDE_BAR_WIDTH,
      width: `calc(100% - ${SIDE_BAR_WIDTH}px)`,
      zIndex: 10,
      background: theme.colors.lightBackground[primaryShade],
      marginLeft: theme.spacing.xl,
      padding: `${theme.spacing.md} ${theme.spacing.xs}`
      // TODO: fix the media query
      // [theme.fn.smallerThan('sm')]: {
      //   left: 0
      // }
    }
  }
})

const GoBack = ({
  title,
  fixed,
  path,
  children
}: { title: string; fixed?: boolean; path?: string } & PropsWithChildren) => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const handleClick = () => (path ? navigate(path, { replace: true }) : navigate(-1))

  return (
    <Flex align="center" className={cx({ [classes.sticky]: !!fixed })}>
      <ActionButton action={handleClick} icon={<LeftChevronIcon />} title={title}>
        <Text fw="bold" size="sm">
          {title}
        </Text>
      </ActionButton>
      {children}
    </Flex>
  )
}

export default GoBack
