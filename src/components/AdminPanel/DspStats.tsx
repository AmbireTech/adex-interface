import { NumberFormatter, Stack, SimpleGrid, Fieldset } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import DetailsRow from 'components/common/DetailsRow'
import useAdmin from 'hooks/useAdmin'
import { useEffect } from 'react'
import { BaseDSPStats, SSPQPSStats } from 'types/dspStats'

const getPercent = (total: number, part: number): string => {
  return ` (${((part / total) * 100).toFixed(2)}%) `
}

const BaseStats = ({ dspStats }: { dspStats: BaseDSPStats }) => {
  return (
    <Stack gap="xs">
      <DetailsRow
        title="Total requests (any kind)"
        value={<NumberFormatter thousandSeparator value={dspStats.totalRequests} />}
      />

      <DetailsRow
        title="Bid requests - total"
        value={
          <div>
            {getPercent(dspStats.totalRequests, dspStats.ortbRequests)}
            <NumberFormatter thousandSeparator value={dspStats.ortbRequests} />
          </div>
        }
      />

      <DetailsRow
        title="Bid requests - throttled"
        value={
          <div>
            {getPercent(dspStats.ortbRequests, dspStats.throttledRequests)}
            <NumberFormatter thousandSeparator value={dspStats.throttledRequests} />
          </div>
        }
      />

      <DetailsRow
        title="Bid requests - no bids"
        value={
          <div>
            {getPercent(dspStats.ortbRequests, dspStats.bidRequestsWithNoBids)}
            <NumberFormatter thousandSeparator value={dspStats.bidRequestsWithNoBids} />
          </div>
        }
      />
      <DetailsRow
        title="Bid requests - in time response"
        value={
          <div>
            {getPercent(dspStats.ortbRequests, dspStats.bidRequestsBidsInTime)}
            <NumberFormatter thousandSeparator value={dspStats.bidRequestsBidsInTime} />
          </div>
        }
      />

      <DetailsRow
        title="Bid requests - NOT in time response"
        value={
          <div>
            {getPercent(dspStats.ortbRequests, dspStats.bidRequestsWithBidsLate)}
            <NumberFormatter thousandSeparator value={dspStats.bidRequestsWithBidsLate} />
          </div>
        }
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
