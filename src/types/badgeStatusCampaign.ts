import { ReactNode } from 'react'

// ether map the number to string key or keep the numbers as in BE
export type BadgeType = number
// export type BadgeType = 'draft' | 'underReview' | 'completed'

export interface IBadgeConfig {
  color: string
  text: string
  icon: ReactNode
}
