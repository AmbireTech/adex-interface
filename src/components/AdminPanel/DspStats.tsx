import { Stack } from '@mantine/core'
import useAdmin from 'hooks/useAdmin'
import { useEffect } from 'react'

const DspStats = () => {
  const { dspStats, getDspStats } = useAdmin()

  useEffect(() => {
    getDspStats()
  }, [])

  return <Stack>{JSON.stringify(dspStats, null, 2)}</Stack>
}

export default DspStats
