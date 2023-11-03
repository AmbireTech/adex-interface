import { useCallback, useState } from 'react'
import { Devices } from 'types'

export default function useSelectedTab(initialTab: Devices | null) {
  const [selectedTab, setSelectedTab] = useState<Devices | null>(initialTab)

  const selectTab = useCallback((tab: Devices) => {
    setSelectedTab(tab)
  }, [])

  return {
    selectedTab,
    selectTab
  }
}
