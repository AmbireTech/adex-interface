import { Badge, Flex, Text } from '@mantine/core'
import { ReactNode } from 'react'
import CompletedIcon from 'resources/icons/CompletedIcon'
import DraftIcon from 'resources/icons/Draft'
import UnderReviewIcon from 'resources/icons/UnderReview'

type BadgeType = 'draft' | 'underReview' | 'completed'

type BadgeConfig = {
  color: string
  text: string
  icon: ReactNode
}

const conf: Record<BadgeType, BadgeConfig> = {
  draft: {
    color: 'draft',
    text: 'Draft',
    icon: <DraftIcon size="11px" />
  },
  underReview: {
    color: 'info',
    text: 'Under review',
    icon: <UnderReviewIcon size="11px" />
  },
  completed: {
    color: 'success',
    text: 'Completed',
    icon: <CompletedIcon size="11px" />
  }
}

const BadgeStatusCampaign: React.FC<{ type: BadgeType }> = ({ type }) => {
  return (
    <Badge variant="outline" color={conf[type].color}>
      <Flex align="center">
        <Text>{conf[type].text}</Text>
        {conf[type].icon}
      </Flex>
    </Badge>
  )
}

export default BadgeStatusCampaign
