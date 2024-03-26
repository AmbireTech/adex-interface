import { useMemo, useState } from 'react'
import { countNestedElements } from 'helpers'
import { Button, Text, Flex, createStyles } from '@mantine/core'
import DownArrowIcon from 'resources/icons/DownArrow'
import { CollapsibleFieldProps, CollapsibleFieldStylesProps } from 'types'

const useStyles = createStyles((theme, { collapsed }: CollapsibleFieldStylesProps) => ({
  lighterColor: {
    color:
      theme.colors.secondaryText[theme.fn.primaryShade()] +
      theme.other.shades.hexColorSuffix.lighter
  },
  icon: {
    width: theme.fontSizes.sm,
    height: theme.fontSizes.sm
  },
  rotateIcon: { transform: 'rotate(-180deg)' },
  collapsibleWrapper: {
    transition: 'max-height 0.8s ease',
    overflow: 'hidden',
    maxHeight: collapsed ? 30 : undefined
  }
}))

const CollapsibleField = ({ label, children }: CollapsibleFieldProps) => {
  const [collapsed, setCollapsed] = useState(true)
  const { classes, cx } = useStyles({ collapsed })

  const nestedElementsCount = useMemo(() => countNestedElements(children), [children])

  return (
    <>
      <Flex justify="space-between" align="center">
        <Text size="sm" className={classes.lighterColor}>
          {label}
        </Text>
        {nestedElementsCount > 2 && (
          <Button
            variant="link"
            color="gray"
            onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
          >
            <DownArrowIcon
              className={cx(classes.icon, classes.lighterColor, {
                [classes.rotateIcon]: !collapsed
              })}
            />
          </Button>
        )}
      </Flex>
      <div className={classes.collapsibleWrapper}>{children}</div>
    </>
  )
}

export default CollapsibleField
