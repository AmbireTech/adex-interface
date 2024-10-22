import { useEffect, useState, useMemo } from 'react'
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
  Center
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

const sspsData: Array<{ value: SSPs | ''; label: string }> = [
  { value: '', label: 'All SSPs' },
  { value: 'Eskimi', label: 'Eskimi' },
  { value: 'Epom', label: 'Epom' },
  { value: 'Qortex', label: 'Qortex' }
]

const placementsData: Array<{ value: string; label: string }> = [
  { value: '', label: 'All placements' },
  { value: RequestStatPlacement.app.toString(), label: 'App' },
  { value: RequestStatPlacement.siteMobile.toString(), label: 'Site - Mobile' },
  { value: RequestStatPlacement.siteDesktop.toString(), label: 'Site - Desktop' },
  { value: RequestStatPlacement.other.toString(), label: 'Site - other' }
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
  format
}: {
  category?: SSPsAnalyticsDataQuery['category']
  country?: SSPsAnalyticsDataQuery['country']
  format?: string[]
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
  const [groupBy, setGrop] = useState<SSPsAnalyticsDataQuery['groupBy']>('country')
  const [placement, setPlacement] = useState<RequestStatPlacement | ''>('')
  const { analyticsData, getAnalyticsKeyAndUpdate } = useSSPsAnalytics()
  const [selectedCountries, setCountries] = useState<SSPsAnalyticsDataQuery['country']>(
    country || { values: [], operator: 'in' }
  )
  const [selectedCategories, setCategories] = useState<SSPsAnalyticsDataQuery['category']>(
    category || { values: [], operator: 'in' }
  )

  const [selectedFormats, setFormats] = useState<string[]>(format || [])

  const analytics = useMemo(
    () => analyticsData.get(analyticsKey?.key || ''),
    [analyticsData, analyticsKey]
  )

  useEffect(() => {
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate({
        ...removeOptionalEmptyStringProps({
          ssp,
          placement,
          category: selectedCategories,
          country: selectedCountries,
          format: selectedFormats
        }),
        limit: 666,
        groupBy
      })
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [
    category,
    country,
    format,
    getAnalyticsKeyAndUpdate,
    groupBy,
    placement,
    selectedCategories,
    selectedCountries,
    selectedFormats,
    ssp
  ])

  const loading = useMemo(() => analytics?.status === 'loading', [analytics])

  const data: { elements: DataElement[]; totalRequests: number } = useMemo(() => {
    return {
      elements:
        analytics?.data.map(({ count, value }) => {
          return {
            id: value.toString() + count.toString(),
            columns: [
              {
                value: value.toString(),
                element: mapSegmentLabel(groupBy, value).label
              },
              { value: count, element: <NumberFormatter value={count} thousandSeparator /> }
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
      <Fieldset>
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
              <Select
                label="Placement"
                value={placement?.toString()}
                // @ts-ignore
                onChange={(val) => setPlacement(val !== '' ? Number(val) : val)}
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
              />
            </Stack>
          </Group>
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
          headings={[groupBy?.toString() || 'data', 'count']}
          data={data.elements}
          loading={loading}
        />
        <Code block>
          {JSON.stringify(
            {
              ssp,
              placement,
              category: selectedCategories,
              country: selectedCountries,
              format,
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
