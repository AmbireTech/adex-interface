import CustomBadge from 'components/common/CustomBadge'
import CompletedIcon from 'resources/icons/CompletedIcon'
import DraftIcon from 'resources/icons/Draft'
import UnderReviewIcon from 'resources/icons/UnderReview'
import { BadgeType, IBadgeConfig } from 'types'

const conf: Record<BadgeType, IBadgeConfig> = {
  draft: {
    color: 'draft',
    text: 'Draft',
    icon: <DraftIcon size="13px" />
  },
  underReview: {
    color: 'info',
    text: 'Under review',
    icon: <UnderReviewIcon size="13px" />
  },
  completed: {
    color: 'success',
    text: 'Completed',
    icon: <CompletedIcon size="13px" />
  }
}

const BadgeStatusCampaign: React.FC<{ type: BadgeType }> = ({ type }) => (
  <CustomBadge color={conf[type].color} text={conf[type].text} icon={conf[type].icon} />
)

export default BadgeStatusCampaign
