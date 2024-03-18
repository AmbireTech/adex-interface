import { Badge, Flex, Text, createStyles } from '@mantine/core'
import CompletedIcon from 'resources/icons/CompletedIcon'
import DraftIcon from 'resources/icons/Draft'
import UnderReviewIcon from 'resources/icons/UnderReview'
import { BadgeType, IBadgeConfig } from 'types'

const conf: Record<BadgeType, IBadgeConfig> = {
  // TODO: Make enum to map statuses from DB (int) to string here, or replace string keys with number
  0: {
    color: 'draft',
    text: 'Draft',
    icon: <DraftIcon size="13px" />
  },
  1: {
    color: 'info',
    text: 'Under review',
    icon: <UnderReviewIcon size="13px" />
  },
  2: {
    color: 'success',
    text: 'Completed',
    icon: <CompletedIcon size="13px" />
  }
}
const useStyles = createStyles((theme, { color }: { color: string }) => ({
  wrapper: {
    background:
      theme.colors[color][theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest,
    fontWeight: 'normal',
    textTransform: 'capitalize'
  }
}))

const BadgeStatusCampaign: React.FC<{ type: BadgeType }> = ({ type }) => {
  const { classes } = useStyles({ color: conf[type].color })

  return (
    <Badge size="lg" variant="outline" color={conf[type].color} className={classes.wrapper}>
      <Flex align="center">
        <Text>{conf[type].text}</Text>
        {conf[type].icon}
      </Flex>
    </Badge>
  )
}

export default BadgeStatusCampaign
