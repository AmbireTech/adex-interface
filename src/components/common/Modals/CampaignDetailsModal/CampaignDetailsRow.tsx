import { Flex, FlexProps, MantineNumberSize, Text, createStyles } from '@mantine/core'

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
  }
}))

type CampaignDetailsRowProps = FlexProps & {
  title: string
  value: any | undefined
  lighterColor?: boolean | undefined
  textSize?: MantineNumberSize
  noBorder?: boolean
  column?: boolean
}

const CampaignDetailsRow = ({
  title,
  value,
  lighterColor,
  textSize = 'md',
  noBorder = false,
  column = false
}: CampaignDetailsRowProps) => {
  const { classes, cx } = useStyles({ lighterColor: !!lighterColor })
  return (
    <Flex
      justify={column ? 'flex-start' : 'space-between'}
      direction={column ? 'column' : 'row'}
      align="center"
      className={cx({ [classes.border]: !noBorder })}
      pt="lg"
      pb="lg"
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
      {/* <Text className={classes.textColor}>{value}</Text> */}
      <Text className={cx({ [classes.fullWidth]: column })}>{value}</Text>
    </Flex>
  )
}

export default CampaignDetailsRow
