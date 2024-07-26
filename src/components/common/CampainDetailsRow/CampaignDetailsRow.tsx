import { Flex, Text, createStyles } from '@mantine/core'
import { CampaignDetailsRowProps } from 'types'

const useStyles = createStyles((theme, { lighterColor }: { lighterColor: boolean }) => ({
  border: {
    borderBottom: `1px dashed ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`
  },
  textColor: {
    color: !lighterColor
      ? theme.colors.secondaryText[theme.fn.primaryShade()]
      : theme.colors.secondaryText[theme.fn.primaryShade()] +
        theme.other.shades.hexColorSuffix.lighter
  },
  fullWidth: {
    width: '100%'
  },
  marginBottom: {
    marginBottom: theme.spacing.sm
  },
  text: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }
}))

const CampaignDetailsRow = ({
  title,
  value,
  lighterColor,
  textSize = 'md',
  noBorder = false,
  column = false,
  lineHeight = 'lg',
  nowrap = false,
  ...rest
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
      {...rest}
    >
      <Text
        className={cx(classes.textColor, {
          [classes.fullWidth]: column,
          [classes.marginBottom]: column
        })}
        weight="bold"
        size={textSize}
      >
        {title}
      </Text>
      <Text className={cx({ [classes.fullWidth]: column, [classes.text]: !!nowrap })}>{value}</Text>
    </Flex>
  )
}

export default CampaignDetailsRow
