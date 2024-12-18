import { NumberFormatter, Stack, SimpleGrid, Fieldset } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import DetailsRow from 'components/common/DetailsRow'
import useAdmin from 'hooks/useAdmin'
import { useEffect } from 'react'
import { BaseDSPStats, SSPQPSStats } from 'types/dspStats'

const BaseStats = ({ dspStats }: { dspStats: BaseDSPStats }) => {
  return (
    <Stack gap="xs">
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
        title="Total requests"
        value={<NumberFormatter thousandSeparator value={dspStats.totalRequests} />}
      />
      <DetailsRow
        title="Throttled requests"
        value={<NumberFormatter thousandSeparator value={dspStats.throttledRequests} />}
      />
      <DetailsRow
        title="Bid requests with late bids"
        value={<NumberFormatter thousandSeparator value={dspStats.bidRequestsWithBidsLate} />}
      />
    </Stack>
  )
}

const DspStats = () => {
  const { dspStats, getDspStats } = useAdmin()

  useEffect(() => {
    getDspStats()
  }, [])

  return (
    <SimpleGrid cols={{ md: 1, xl: 2 }} spacing="xl">
      <Fieldset p="lg" legend="Totals">
        <BaseStats dspStats={dspStats} />
      </Fieldset>

      <Fieldset p="lg" legend="Past 24h">
        {dspStats.last24h && <BaseStats dspStats={dspStats.last24h} />}
      </Fieldset>
      <Fieldset p="lg" legend="Current">
        <Stack gap="xs">
          <DetailsRow
            title="Total Bid requests per second"
            value={<NumberFormatter thousandSeparator value={dspStats.ortbRequestsPerSecond} />}
          />
          <DetailsRow
            title="Throttled requests per second"
            value={
              <NumberFormatter thousandSeparator value={dspStats.throttledRequestsPerSecond} />
            }
          />
        </Stack>
      </Fieldset>
      <Fieldset p="lg" legend="SSPs (per second)">
        <CustomTable
          headings={['SSP', 'cfg QPS', 'current QPS', 'current dropped']}
          data={dspStats.ssp.map((ssp: SSPQPSStats) => ({
            id: ssp.name,
            columns: [
              { value: ssp.name },
              { value: ssp.qpsConfig },
              { value: ssp.qpsCurrent },
              { value: ssp.qpsDropped }
            ]
          }))}
        />
      </Fieldset>
    </SimpleGrid>
  )
}

export default DspStats
