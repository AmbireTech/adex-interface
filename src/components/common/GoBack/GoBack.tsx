import { Text, createStyles } from '@mantine/core'
import ActionButton from 'components/common/CustomTable/ActionButton/ActionButton'
import LeftChevronIcon from 'resources/icons/LeftChevron'
import { useNavigate } from 'react-router-dom'
import { SIDE_BAR_WIDTH } from 'themes/base'

const useStyles = createStyles((theme) => ({
  sticky: {
    position: 'fixed',
    top: 90,
    left: SIDE_BAR_WIDTH,
    width: '100%',
    zIndex: 1000,
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    marginLeft: theme.spacing.xl,
    padding: `${theme.spacing.md} ${theme.spacing.xs}`,
    [theme.fn.smallerThan('sm')]: {
      left: 0
    }
  }
}))

const GoBack = ({ title, fixed }: { title: string; fixed?: boolean }) => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const handleClick = () => navigate(-1)

  return (
    <div className={cx({ [classes.sticky]: !!fixed })}>
      <ActionButton action={handleClick} icon={<LeftChevronIcon />} title={title}>
        <Text size="sm">{title}</Text>
      </ActionButton>
    </div>
  )
}

export default GoBack
