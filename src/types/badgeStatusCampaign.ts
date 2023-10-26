import { ReactNode } from 'react'

export type BadgeType = 'draft' | 'underReview' | 'completed'

export interface IBadgeConfig {
  color: string
  text: string
  icon: ReactNode
}
