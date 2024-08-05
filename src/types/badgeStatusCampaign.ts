import { ReactNode } from 'react'
import { CampaignStatus } from 'adex-common'
import { MantineColor, MantineSize } from '@mantine/core'

// ether map the number to string key or keep the numbers as in BE
export type BadgeType = { type: CampaignStatus; isArchived?: boolean }
// export type BadgeType = 'draft' | 'underReview' | 'completed'

export interface IBadgeConfig {
  color: MantineColor
  text: string
  icon: ReactNode
  size?: MantineSize
}
