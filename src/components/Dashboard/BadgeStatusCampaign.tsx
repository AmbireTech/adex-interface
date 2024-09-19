import { useMemo } from 'react'
import { BadgeType, IBadgeConfig } from 'types'
import { CampaignStatus } from 'adex-common'
import CustomBadge from 'components/common/CustomBadge'
import CompletedIcon from 'resources/icons/CompletedIcon'
import DraftIcon from 'resources/icons/Draft'
import UnderReviewIcon from 'resources/icons/UnderReview'
import StopIcon from 'resources/icons/Stop'
import ActiveIcon from 'resources/icons/Active'
import PausedIcon from 'resources/icons/Paused'
import ArchivedIcon from 'resources/icons/Archived'

const BadgeStatusCampaign = ({ type, isArchived }: BadgeType) => {
  const labelCfg = useMemo<IBadgeConfig>(() => {
    const status = type
    if (isArchived) {
      return {
        color: 'secondaryText',
        text: 'Archived',
        icon: <ArchivedIcon size="10px" />,
        size: 'md'
      }
    }
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

      case CampaignStatus.exhausted:
        return {
          // TODO: check what color needs to be
          color: 'stopped',
          text: 'Exhausted',
          icon: undefined
        }
      case CampaignStatus.paused:
        return {
          color: 'paused',
          text: 'Paused',
          icon: <PausedIcon size="13px" />
        }
      case CampaignStatus.rejected:
        return {
          color: 'warning',
          text: 'Rejected',
          icon: <UnderReviewIcon size="13px" />
        }
      case CampaignStatus.draft:
        return {
          color: 'draft',
          text: 'Draft',
          icon: <DraftIcon size="13px" />
        }

      default:
        return {
          color: 'secondaryText',
          text: 'Unknown',
          icon: undefined
        }
    }
  }, [isArchived, type])

  return (
    <CustomBadge
      color={labelCfg.color}
      text={labelCfg.text}
      icon={labelCfg.icon}
      size={labelCfg.size}
    />
  )
}

export default BadgeStatusCampaign
