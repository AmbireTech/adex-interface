import { ActionIcon, createStyles } from '@mantine/core'
import { ReactNode } from 'react'

const useStyles = createStyles((theme) => ({
  actionIcon: {
    '&:hover': {
      color: theme.colors.brand[theme.fn.primaryShade()]
    }
  }
}))

const ActionButton = ({
  action,
  icon,
  title
}: {
  action: (e: any) => any
  icon: ReactNode
  title: string
}) => {
  const { classes } = useStyles()
  return (
    <ActionIcon title={title} variant="transparent" onClick={action} className={classes.actionIcon}>
      {icon}
    </ActionIcon>
  )
}

export default ActionButton
