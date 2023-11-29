import { Devices } from 'types'

export const checkSelectedDevices = (devices: Devices[]) => {
  return devices.length === 1 && devices.includes('mobile')
    ? 'mobile'
    : devices.length === 1 && devices.includes('desktop')
    ? 'desktop'
    : devices.length === 2
    ? 'both'
    : null
}
