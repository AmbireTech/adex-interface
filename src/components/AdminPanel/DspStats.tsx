import { NumberFormatter, Stack, Divider, Space } from '@mantine/core'
import DetailsRow from 'components/common/DetailsRow'
import useAdmin from 'hooks/useAdmin'
import { useEffect } from 'react'

const DspStats = () => {
  const { dspStats, getDspStats } = useAdmin()

  useEffect(() => {
    getDspStats()
  }, [])

  return (
    <Stack maw={420} gap="xs">
      <DetailsRow
        title="Total ORTB requests"
        value={<NumberFormatter thousandSeparator value={dspStats.ortbRequests} />}
      />
      <DetailsRow
        title="Bid requests with no bids"
        value={<NumberFormatter thousandSeparator value={dspStats.bidRequestsWithNoBids} />}
      />
      <DetailsRow
        title="Bid requests in time"
        value={<NumberFormatter thousandSeparator value={dspStats.bidRequestsBidsInTime} />}
      />
      <DetailsRow
        title="Bid requests with late bids"
        value={<NumberFormatter thousandSeparator value={dspStats.bidRequestsWithBidsLate} />}
      />
      <DetailsRow
        title="Total Bid requests per second"
        value={<NumberFormatter thousandSeparator value={dspStats.ortbRequestsPerSecond} />}
      />
      <DetailsRow
        title="Total requests"
        value={<NumberFormatter thousandSeparator value={dspStats.totalRequests} />}
      />
      <DetailsRow
        title="Throttled requests"
        value={<NumberFormatter thousandSeparator value={dspStats.throttledRequests} />}
      />
      <DetailsRow
        title="Throttled requests per second"
        value={<NumberFormatter thousandSeparator value={dspStats.throttledRequestsPerSecond} />}
      />
      <Space />
      {dspStats.ssp.map((ssp) => (
        <Stack gap={0}>
          <DetailsRow id={ssp.name} title="ssp" value={ssp.name} />
          <DetailsRow
            id={ssp.name}
            title="qps cfg"
            value={<NumberFormatter thousandSeparator value={ssp.qpsConfig} />}
          />
          <DetailsRow
            id={ssp.name}
            title="qps current"
            value={<NumberFormatter thousandSeparator value={ssp.qpsCurrent} />}
          />
          <DetailsRow
            id={ssp.name}
            title="qps dropped"
            value={<NumberFormatter thousandSeparator value={ssp.qpsDropped} />}
            noBorder
          />
          <Divider size="xl" />
        </Stack>
      ))}
    </Stack>
  )
}

export default DspStats
