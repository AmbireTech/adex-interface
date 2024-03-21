import CustomBadge from 'components/common/CustomBadge'
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

const BadgeStatusCampaign: React.FC<{ type: BadgeType }> = ({ type }) => (
  <CustomBadge color={conf[type].color} text={conf[type].text} icon={conf[type].icon} />
)

export default BadgeStatusCampaign
