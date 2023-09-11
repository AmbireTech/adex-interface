import { createStyles } from '@mantine/core'
import * as blockies from 'blockies-ts'

const useStyles = createStyles((theme, { size, icon }: { size: string; icon: string }) => ({
  icon: {
    flex: '0 0 auto',
    height: size,
    width: size,
    borderRadius: theme.radius.md,
    backgroundSize: 'cover',
    backgroundImage: `url(${icon})`
  }
}))

const Blockies = ({ seedString, size = '2rem' }: { seedString: string; size?: string }) => {
  const icon = blockies.create({ seed: seedString }).toDataURL()
  const { classes } = useStyles({ size, icon })

  return <div className={classes.icon} />
}

export default Blockies
