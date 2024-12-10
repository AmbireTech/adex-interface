import { useCallback, useState, useMemo, useEffect } from 'react'
import {
  Select,
  Stack,
  Group,
  Badge,
  Text,
  Loader,
  Code,
  NumberFormatter,
  MultiSelect,
  Fieldset,
  Divider,
  ThemeIcon,
  Center,
  Button
} from '@mantine/core'
import { SSPs, RequestStatPlacement, SSPsAnalyticsDataQuery } from 'types'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'
import CustomTable, { DataElement } from 'components/common/CustomTable'
import { removeOptionalEmptyStringProps, getEnumKeyByValue } from 'helpers'
import DownloadCSV from 'components/common/DownloadCSV'
import { CountryData } from 'helpers/countries'
import { IabTaxonomyV3 } from 'adex-common'
import { CATEGORIES, CAT_GROUPS, COUNTRIES, REGION_GROUPS } from 'constants/createCampaign'
import MultiSelectAndRadioButtons from 'components/CreateCampaign/StepTwo/MultiSelectAndRadioButtons'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import GlobeIcon from 'resources/icons/Globe'
import InvoiceIcon from 'resources/icons/Invoice'
import { parseRange } from 'helpers/createCampaignHelpers'

const sspsData: Array<{ value: SSPs | ''; label: string }> = [
  { value: '', label: 'All SSPs' },
  { value: 'Eskimi', label: 'Eskimi' },
  { value: 'Epom', label: 'Epom' },
  { value: 'Qortex', label: 'Qortex' }
]

const placementsData: Array<{ value: string; label: string }> = [
  { value: RequestStatPlacement.app.toString(), label: 'App' },
  { value: RequestStatPlacement.siteMobile.toString(), label: 'Site - Mobile' },
  { value: RequestStatPlacement.siteDesktop.toString(), label: 'Site - Desktop' },
  { value: RequestStatPlacement.siteOther.toString(), label: 'Site - other' },
  { value: RequestStatPlacement.other.toString(), label: 'Other' }
]

const groupByData: Array<{ value: string; label: string }> = [
  { value: 'bidfloor', label: 'bid Floor' },
  { value: 'date', label: 'date' },
  { value: 'category', label: 'category' },
  { value: 'placement', label: 'placement' },
  { value: 'country', label: 'country' },
  { value: 'ssp', label: 'ssp' },
  { value: 'format', label: 'format' }
]

const mapSegmentLabel = (
  type: SSPsAnalyticsDataQuery['groupBy'],
  segment: string | number
): { label: string } => {
  let label = (segment || '').toString()

  switch (type) {
    case 'country':
      label = `${CountryData.get(segment.toString().toUpperCase())?.name} (${segment
        .toString()
        .toUpperCase()})`
      break
    case 'category':
      label = `${getEnumKeyByValue(
        IabTaxonomyV3,
        segment.toString().toUpperCase() || ''
      )} (${segment.toString().toUpperCase()})`
      break

    case 'placement':
      label = getEnumKeyByValue(RequestStatPlacement, segment)
      break
    case 'bidfloor': {
      const range = parseRange(segment.toString())
      label = `${range.min} - ${range.max}`
      break
    }

    default:
      break
  }

  return {
    label
  }
}

const SSPsAnalytics = ({
  country,
  category,
  format,
  placement
}: {
  category?: SSPsAnalyticsDataQuery['category']
  country?: SSPsAnalyticsDataQuery['country']
  format?: SSPsAnalyticsDataQuery['format']
  placement?: SSPsAnalyticsDataQuery['placement']
}) => {
  // TODO: get all formats once then use it for src
  // NOTE: temp
  const { allowedBannerSizes } = useCreateCampaignContext()

  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
      }
    | undefined
  >()

  const [ssp, setSsp] = useState<SSPs>('')
  const [groupBy, setGrop] = useState<SSPsAnalyticsDataQuery['groupBy']>('ssp')
  const [selectedPlacement, setPlacement] = useState<SSPsAnalyticsDataQuery['placement']>(
    placement || { values: [], operator: 'in' }
  )
  const { analyticsData, getAnalyticsKeyAndUpdate } = useSSPsAnalytics()
  const [selectedCountries, setCountries] = useState<SSPsAnalyticsDataQuery['country']>(
    country || { values: [], operator: 'in' }
  )
  const [selectedCategories, setCategories] = useState<SSPsAnalyticsDataQuery['category']>(
    category || { values: [], operator: 'in' }
  )

  const [selectedFormats, setFormats] = useState<SSPsAnalyticsDataQuery['format']>(format || [])

  const analytics = useMemo(
    () => analyticsData.get(analyticsKey?.key || ''),
    [analyticsData, analyticsKey]
  )

  const [fieldChanged, setFieldChanged] = useState(true)

  useEffect(() => {
    setFieldChanged(true)
  }, [groupBy, selectedCategories, selectedCountries, selectedFormats, selectedPlacement, ssp])

  const updateAnalytics = useCallback(() => {
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate({
        ...removeOptionalEmptyStringProps({
          ssp,
          placement: selectedPlacement,
          category: selectedCategories,
          country: selectedCountries,
          format: selectedFormats
        }),
        limit: 666,
        groupBy,
        showBidCount: true
      })
      setAnalyticsKey(key)
      setFieldChanged(false)
      // console.log('key', key)
    }

    checkAnalytics()
  }, [
    getAnalyticsKeyAndUpdate,
    groupBy,
    selectedCategories,
    selectedCountries,
    selectedFormats,
    selectedPlacement,
    ssp
  ])

  const loading = useMemo(() => analytics?.status === 'loading', [analytics])

  const data: { elements: DataElement[]; totalRequests: number } = useMemo(() => {
    return {
      elements:
        analytics?.data.map(({ count, value, bids, billed, imps }) => {
          const bidsToImpressionRation = ((imps || 0) / (bids || 1)) * 100
          const billedToImpressionsRate = ((imps || 0) / (billed || 1)) * 100
          return {
            id: value.toString() + count.toString(),
            columns: [
              {
                value: value.toString(),
                element: mapSegmentLabel(groupBy, value).label
              },
              { value: count, element: <NumberFormatter value={count} thousandSeparator /> },
              { value: bids, element: <NumberFormatter value={bids} thousandSeparator /> },
              { value: billed, element: <NumberFormatter value={billed} thousandSeparator /> },
              { value: imps, element: <NumberFormatter value={imps} thousandSeparator /> },
              { value: bidsToImpressionRation, element: `${bidsToImpressionRation.toFixed(2)} %` },
              { value: billedToImpressionsRate, element: `${billedToImpressionsRate.toFixed(2)} %` }
            ]
          }
        }) || [],
      totalRequests: analytics?.data.reduce((sum, i) => sum + i.count, 0) || 0
    }
  }, [analytics?.data, groupBy])

  return (
    <Stack gap="xs">
      <Text size="sm" inline c="purple">
        * This analytics are for the actual processed request from our SSRs (oRtb: BidRequest) for
        the <strong>48 hours</strong>
      </Text>
      <Fieldset pos="relative">
        <Stack>
          <Group align="start" justify="left" gap="xl" grow>
            <Stack gap="xs">
              <Select
                label="Group by"
                value={groupBy}
                onChange={(val) => setGrop(val as SSPsAnalyticsDataQuery['groupBy'])}
                data={groupByData}
                searchable
                size="sm"
              />
              <MultiSelect
                label="Formats"
                value={selectedFormats}
                onChange={setFormats}
                data={allowedBannerSizes}
                clearable
                searchable
                size="sm"
              />
            </Stack>
            <Stack>
              <Select
                label="SSP"
                value={ssp}
                onChange={(val) => setSsp(val as SSPs)}
                data={sspsData}
                searchable
                size="sm"
              />
              <MultiSelect
                label="Placement"
                value={selectedPlacement?.values?.map((x) => x.toString())}
                // @ts-ignore
                onChange={(val) =>
                  setPlacement(() => ({
                    values: [...val.map((x) => Number(x))],
                    operator: 'in'
                  }))
                }
                clearable
                data={placementsData}
                size="sm"
              />
            </Stack>
          </Group>

          <Group grow gap="xl" align="baseline">
            <Stack>
              <Divider
                mt="xl"
                labelPosition="left"
                label={
                  <Center style={{ gap: 10 }}>
                    <Text c="mainText" size="sm">
                      Categories
                    </Text>
                    <ThemeIcon size="sm" variant="transparent" color="mainText">
                      <InvoiceIcon />
                    </ThemeIcon>
                  </Center>
                }
              />
              <MultiSelectAndRadioButtons
                onCategoriesChange={(selectedRadio, values) =>
                  setCategories({
                    values: values as IabTaxonomyV3[],
                    operator: selectedRadio === 'all' ? undefined : selectedRadio
                  })
                }
                multiSelectData={CATEGORIES}
                defaultRadioValue={selectedCategories?.operator}
                defaultSelectValue={selectedCategories?.values}
                groups={CAT_GROUPS}
                label="Categories"
                size="sm"
              />
            </Stack>
            <Stack>
              <Divider
                mt="xl"
                labelPosition="left"
                label={
                  <Center style={{ gap: 10 }}>
                    <Text c="mainText" size="sm">
                      Countries
                    </Text>
                    <ThemeIcon size="sm" variant="transparent" color="mainText">
                      <GlobeIcon />
                    </ThemeIcon>
                  </Center>
                }
              />

              <MultiSelectAndRadioButtons
                onCategoriesChange={(selectedRadio, values) =>
                  setCountries({
                    values,
                    operator: selectedRadio === 'all' ? undefined : selectedRadio
                  })
                }
                defaultRadioValue={selectedCountries?.operator}
                defaultSelectValue={selectedCountries?.values}
                multiSelectData={COUNTRIES}
                groups={REGION_GROUPS}
                label="Countries"
                size="sm"
              />
            </Stack>
          </Group>

          <Button onClick={updateAnalytics} loading={loading} disabled={!fieldChanged}>
            Get analytics
          </Button>
        </Stack>
      </Fieldset>
      <Group align="center" justify="left" gap="xs" pos="relative">
        <Badge size="lg" leftSection="Total requests">
          {loading ? <Loader type="dots" color="white" /> : data.totalRequests.toLocaleString()}
        </Badge>

        <DownloadCSV
          // TODO: fix anal type
          // @ts-ignore
          data={analytics?.data?.map((x) => ({
            value: x.count,
            segment: x.value.toString()
          }))}
          // mapHeadersToDataProperties={{ [analType]: 'segment', ...csvHeaders }}
          filename={`${analyticsKey?.key || 'admin-data-export'}.csv`}
          // disabled={loading}
          disabled
        />
      </Group>
      <Stack>
        <CustomTable
          pageSize={10}
          headings={[
            groupBy?.toString() || 'data',
            'slots',
            'bids',
            'billed impressions',
            'verified impressions',
            'bids success rate',
            'billed to verified impressions rate'
          ]}
          data={data.elements}
          loading={loading}
        />
        <Code block>
          {JSON.stringify(
            {
              ssp,
              placement: selectedPlacement,
              category: selectedCategories,
              country: selectedCountries,
              format: selectedFormats,
              groupBy
            },
            null,
            2
          )}
        </Code>
      </Stack>
    </Stack>
  )
}

export default SSPsAnalytics
