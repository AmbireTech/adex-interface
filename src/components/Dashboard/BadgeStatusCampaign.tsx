import CustomBadge from 'components/common/CustomBadge'
import { useCallback, useMemo } from 'react'
import CompletedIcon from 'resources/icons/CompletedIcon'
import DraftIcon from 'resources/icons/Draft'
import UnderReviewIcon from 'resources/icons/UnderReview'
import { BadgeType, IBadgeConfig } from 'types'
import { CampaignStatus } from 'adex-common'

const BadgeStatusCampaign = ({ type }: BadgeType) => {
  const getStatusLabel = useCallback((status: number): IBadgeConfig => {
    switch (status) {
      case CampaignStatus.created:
        return {
          color: 'success',
          text: 'Created',
          icon: <DraftIcon size="13px" />
        }

      case CampaignStatus.inReview:
        return {
          color: 'info',
          text: 'Under review',
          icon: <UnderReviewIcon size="13px" />
        }

      case CampaignStatus.ready:
        return {
          color: 'completed',
          text: 'Completed',
          icon: <CompletedIcon size="13px" />
        }

      case CampaignStatus.active:
        return {
          color: 'success',
          text: 'Active',
          icon: <CompletedIcon size="13px" />
        }

      case CampaignStatus.closedByUser:
        return {
          color: 'success',
          text: 'Closed by user',
          icon: <CompletedIcon size="13px" />
        }

      case CampaignStatus.expired:
        return {
          color: 'success',
          text: 'Expired',
          icon: <CompletedIcon size="13px" />
        }

      default:
        return {
          color: 'draft',
          text: 'Unknown',
          icon: <DraftIcon size="13px" />
        }
    }
  }, [])

  const status = useMemo(() => getStatusLabel(type), [getStatusLabel, type])

  return <CustomBadge color={status.color} text={status.text} icon={status.icon} />
}

export default BadgeStatusCampaign
