import { Devices } from './createCampaign'

export type SelectDeviceProps = {
  selectedTab: Devices | null
  selectTab: (tab: Devices) => void
}
