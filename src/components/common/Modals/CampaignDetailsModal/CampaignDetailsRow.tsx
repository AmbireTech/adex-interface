import { Flex, Text, createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  border: {
    borderBottom: `1px dashed ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`
  }
}))

const CampaignDetailsRow = ({ title, value }: { title: string; value: any | undefined }) => {
  const { classes } = useStyles()
  return (
    <Flex key={title} justify="space-between" className={classes.border} p="sm">
      <Text color="secondaryText" weight="bold">
        {title}
      </Text>
      <Text color="secondaryText">{value}</Text>
    </Flex>
  )
}

export default CampaignDetailsRow
