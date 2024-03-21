import React, { useState } from 'react'
import { Collapse, Button, Text, Flex, createStyles } from '@mantine/core'
import DownArrowIcon from '../../../resources/icons/DownArrow'

type CollapsibleFieldProps = {
  label: string
  children: React.ReactNode
}

const useStyles = createStyles((theme) => ({
  lighterColor: {
    color:
      theme.colors.secondaryText[theme.fn.primaryShade()] +
      theme.other.shades.hexColorSuffix.lighter
  },
  icon: {
    width: theme.fontSizes.sm,
    height: theme.fontSizes.sm
  },
  rotateIcon: { transform: 'rotate(-180deg)' }
}))

function CollapsibleField({ label, children }: CollapsibleFieldProps) {
  const { classes, cx } = useStyles()
  const [collapsed, setCollapsed] = useState(true)

  return (
    <>
      <Flex justify="space-between" align="center">
        <Text size="sm" className={classes.lighterColor}>
          {label}
        </Text>
        <Button
          variant="link"
          color="gray"
          onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
        >
          <DownArrowIcon
            className={cx(classes.icon, classes.lighterColor, { [classes.rotateIcon]: !collapsed })}
          />
        </Button>
      </Flex>
      <Collapse in={!collapsed}>
        <div>{children}</div>
      </Collapse>
    </>
  )
}

export default CollapsibleField
