import { useCallback, useState } from 'react'
import { Box, Flex, MantineTheme, Text, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import InvisibilityIcon from 'resources/icons/Invisibility'
import VisibilityIcon from 'resources/icons/Visibility'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import { ChartControlBtnProps, ChartControlBtnStyleProps } from 'types'
import { useColorScheme } from '@mantine/hooks'

const useStyles = createStyles(
  (theme: MantineTheme, { bgColor, whiteFontColor }: ChartControlBtnStyleProps) => {
    const colorScheme = useColorScheme()
    const primaryShade = getPrimaryShade(theme, colorScheme)

    return {
      chartControls: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 205,
        height: 69,
        background: theme.colors[bgColor][primaryShade],
        borderRadius: theme.radius.md,
        padding: theme.spacing.sm,
        cursor: 'pointer',
        color: whiteFontColor ? theme.colors.mainBackground[primaryShade] : ''
      },
      iconSizeSm: {
        width: 10,
        height: 10
      },
      iconSizeLg: {
        width: 20,
        height: 20
      }
    }
  }
)

const ChartControlBtn = ({
  value,
  text,
  bgColor,
  onClick,
  whiteFontColor
}: ChartControlBtnProps) => {
  const { classes } = useStyles({ bgColor, whiteFontColor: !!whiteFontColor })
  const [visible, setVisible] = useState<boolean>(true)

  const handleClick = useCallback(() => {
    setVisible((prev) => {
      const updatedVisible = !prev
      onClick(updatedVisible)
      return updatedVisible
    })
  }, [onClick])

  return (
    <Box className={classes.chartControls} onClick={handleClick}>
      <Flex direction="row" justify="space-between">
        <Text size="md" fw="bold">
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
