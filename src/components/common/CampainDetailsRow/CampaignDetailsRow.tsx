import { Flex, MantineTheme, Text, getPrimaryShade, lighten } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { CampaignDetailsRowProps } from 'types'

const useStyles = createStyles(
  (theme: MantineTheme, { lighterColor }: { lighterColor: boolean }) => {
    const colorScheme = useColorScheme()
    const primaryShade = getPrimaryShade(theme, colorScheme)

    return {
      border: {
        borderBottom: `1px dashed ${theme.colors.decorativeBorders[primaryShade]}`
      },
      textColor: {
        color: !lighterColor
          ? theme.colors.secondaryText[primaryShade]
          : lighten(theme.colors.secondaryText[primaryShade], theme.other.shades.lighten.lighter)
      },
      fullWidth: {
        width: '100%'
      },
      marginBottom: {
        marginBottom: theme.spacing.sm
      },
      text: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }
    }
  }
)

const CampaignDetailsRow = ({
  title,
  value,
  lighterColor,
  textSize = 'md',
  noBorder = false,
  column = false,
  lineHeight = 'lg',
  nowrap = false
}: CampaignDetailsRowProps) => {
  const { classes, cx } = useStyles({ lighterColor: !!lighterColor })
  return (
    <Flex
      justify={column ? 'flex-start' : 'space-between'}
      direction={column ? 'column' : 'row'}
      align="center"
      className={cx({ [classes.border]: !noBorder })}
      pt={lineHeight}
      pb={lineHeight}
      gap="sm"
    >
      <Text
        className={cx(classes.textColor, {
          [classes.fullWidth]: column,
          [classes.marginBottom]: column
        })}
        fw="bold"
        size={textSize}
      >
        {title}
      </Text>
      <div className={cx({ [classes.fullWidth]: column, [classes.text]: !!nowrap })}>{value}</div>
    </Flex>
  )
}

export default CampaignDetailsRow
