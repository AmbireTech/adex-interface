import { useState } from 'react'
import { Box, Flex, Text, createStyles } from '@mantine/core'
import InvisibilityIcon from 'resources/icons/Invisibility'
import VisibilityIcon from 'resources/icons/Visibility'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import { ChartControlBtnProps, ChartControlBtnStyleProps } from 'types'

const useStyles = createStyles((theme, { bgColor, whiteFontColor }: ChartControlBtnStyleProps) => ({
  chartControls: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 205,
    height: 69,
    background: theme.colors[bgColor][theme.fn.primaryShade()],
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    cursor: 'pointer',
    color: whiteFontColor ? theme.colors.mainBackground[theme.fn.primaryShade()] : ''
  },
  iconSizeSm: {
    width: 10,
    height: 10
  },
  iconSizeLg: {
    width: 20,
    height: 20
  }
}))

const ChartControlBtn = ({
  value,
  text,
  bgColor,
  onClick,
  whiteFontColor
}: ChartControlBtnProps) => {
  const { classes } = useStyles({ bgColor, whiteFontColor: !!whiteFontColor })
  const [visible, setVisible] = useState<boolean>(true)

  const handleClick = () => {
    setVisible((prev) => {
      const updatedVisible = !prev
      onClick(updatedVisible)
      return updatedVisible
    })
  }

  return (
    <Box className={classes.chartControls} onClick={handleClick}>
      <Flex direction="row" justify="space-between">
        <Text size="md" weight="bold">
          {value}
        </Text>
        {visible ? (
          <VisibilityIcon className={classes.iconSizeLg} />
        ) : (
          <InvisibilityIcon className={classes.iconSizeLg} />
        )}
      </Flex>
      <Text size="sm">
        {text} <InfoFilledIcon className={classes.iconSizeSm} />
      </Text>
    </Box>
  )
}

export default ChartControlBtn
