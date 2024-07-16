import { Flex, MantineTheme, Text } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { CampaignDetailsRowProps } from 'types'

const useStyles = createStyles(
  (theme: MantineTheme, { lighterColor }: { lighterColor: boolean }) => ({
    border: {
      borderBottom: `1px dashed ${theme.colors.decorativeBorders[3]}`
    },
    textColor: {
      color: !lighterColor
        ? theme.colors.secondaryText[3]
        : theme.colors.secondaryText[3] + theme.other.shades.hexColorSuffix.lighter
    },
    fullWidth: {
      width: '100%'
    },
    marginBottom: {
      marginBottom: theme.spacing.sm
    },
    text: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }
  })
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
