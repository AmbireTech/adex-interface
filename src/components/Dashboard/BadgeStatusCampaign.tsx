import { useCallback, useMemo } from 'react'
import { BadgeType, IBadgeConfig } from 'types'
import { CampaignStatus } from 'adex-common'
import CustomBadge from 'components/common/CustomBadge'
import CompletedIcon from 'resources/icons/CompletedIcon'
import DraftIcon from 'resources/icons/Draft'
import UnderReviewIcon from 'resources/icons/UnderReview'
import StopIcon from 'resources/icons/Stop'
import ActiveIcon from 'resources/icons/Active'
import PausedIcon from 'resources/icons/Paused'
// import ArchivedIcon from 'resources/icons/Archived'

const BadgeStatusCampaign = ({ type }: BadgeType) => {
  const getStatusLabel = useCallback((status: number): IBadgeConfig => {
    console.log({ status })
    switch (status) {
      case CampaignStatus.created:
        return {
          color: 'draft',
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
          color: 'blue',
          text: 'Ready',
          icon: <CompletedIcon size="13px" />
        }

      case CampaignStatus.closedByUser:
        return {
          color: 'stopped',
          text: 'Stopped',
          icon: <StopIcon size="13px" />
        }

      case CampaignStatus.expired:
        return {
          color: 'completed',
          text: 'Completed',
          icon: <CompletedIcon size="13px" />
        }

      case CampaignStatus.active:
        return {
          color: 'success',
          text: 'Active',
          icon: <ActiveIcon size="13px" />
        }
      // TODO: uncomment when CampaignStatus.stopped is added
      // case CampaignStatus.stopped:
      //   return {
      //     color: 'stopped',
      //     text: 'Stopped',
      //     icon: <StopIcon size="13px" />
      //   }
      // TODO: uncomment when CampaignStatus.paused is added
      case CampaignStatus.paused:
        return {
          color: 'paused',
          text: 'Paused',
          icon: <PausedIcon size="13px" />
        }
      // TODO: uncomment when CampaignStatus.archived is added
      // case CampaignStatus.archived:
      //   return {
      //     color: 'secondaryText',
      //     text: 'Archived',
      //     icon: <ArchivedIcon size="13px" />
      //   }
      // TODO: uncomment when CampaignStatus.rejected is added
      // case CampaignStatus.rejected:
      //   return {
      //     color: 'warning',
      //     text: 'Rejected',
      //     icon: <UnderReviewIcon size="13px" />
      //   }
      // TODO: uncomment when CampaignStatus.draft is added
      // case CampaignStatus.draft:
      //   return {
      //     color: 'draft',
      //     text: 'Created',
      //     icon: <DraftIcon size="13px" />
      //   }

      default:
        return {
          color: 'secondaryText',
          text: 'Unknown',
          icon: undefined
        }
    }
  }, [])

  const status = useMemo(() => getStatusLabel(type), [getStatusLabel, type])

  console.log({ status })

  return <CustomBadge color={status.color} text={status.text} icon={status.icon} />
}

export default BadgeStatusCampaign
