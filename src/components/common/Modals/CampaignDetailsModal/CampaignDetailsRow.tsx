import { Flex, Text, createStyles } from '@mantine/core'

const useStyles = createStyles((theme, { lighterColor }: { lighterColor: boolean }) => ({
  border: {
    borderBottom: `1px dashed ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`
  },
  textColor: {
    color: !lighterColor
      ? theme.colors.secondaryText[theme.fn.primaryShade()]
      : theme.colors.secondaryText[theme.fn.primaryShade()] +
        theme.other.shades.hexColorSuffix.lighter
  }
}))

type CampaignDetailsRowProps = {
  title: string
  value: any | undefined
  lighterColor?: boolean | undefined
}

const CampaignDetailsRow = ({ title, value, lighterColor }: CampaignDetailsRowProps) => {
  const { classes } = useStyles({ lighterColor: !!lighterColor })
  return (
    <Flex key={title} justify="space-between" className={classes.border} p="lg">
      <Text className={classes.textColor} weight="bold">
        {title}
      </Text>
      <Text className={classes.textColor}>{value}</Text>
    </Flex>
  )
}

export default CampaignDetailsRow
