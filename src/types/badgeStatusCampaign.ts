import { ReactNode } from 'react'
import { CampaignStatus } from 'adex-common'

// ether map the number to string key or keep the numbers as in BE
export type BadgeType = { type: CampaignStatus }
// export type BadgeType = 'draft' | 'underReview' | 'completed'

export interface IBadgeConfig {
  color: string
  text: string
  icon: ReactNode
}
