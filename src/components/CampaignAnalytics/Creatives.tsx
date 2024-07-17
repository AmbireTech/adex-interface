import { useMemo } from 'react'
import CustomTable from 'components/common/CustomTable'
import { Flex, Anchor, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import UrlIcon from 'resources/icons/Url'
import { BaseAnalyticsData } from 'types'
import { formatCurrency } from 'helpers'
import { AdUnit } from 'adex-common'
import { getMediaUrlWithProvider } from 'helpers/createCampaignHelpers'
import MediaThumb from 'components/common/MediaThumb'
import { useColorScheme } from '@mantine/hooks'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    icon: {
      color: theme.colors.brand[primaryShade]
    }
  }
})

const Creatives = ({
  creatives,
  units,
  currencyName
}: {
  creatives: BaseAnalyticsData[] | undefined
  units: AdUnit[] | undefined
  currencyName: string
}) => {
  const { classes } = useStyles()

  const headings = useMemo(
    () => ['Media', 'Size', 'Impressions', 'Clicks', 'CTR %', 'Spent', 'Target'],
    []
  )

  const elements = useMemo(() => {
    return creatives?.map((item) => {
      const unitForId = units?.find((x) => x.id === item.segment)
      const media = getMediaUrlWithProvider(unitForId?.banner?.mediaUrl, IPFS_GATEWAY) || ''

      return {
        media: (
          <Flex align="center">
            <Anchor href={media} target="_blank" mr="sm">
              <UrlIcon size="25px" className={classes.icon} />
            </Anchor>
            {unitForId && <MediaThumb adUnit={unitForId} previewOnClick />}
          </Flex>
        ),
        size: unitForId?.banner
          ? `${unitForId?.banner?.format.w}x${unitForId?.banner?.format.h}`
          : '',
        impressions: formatCurrency(item.impressions, 0),
        clicks: formatCurrency(item.clicks, 0),
        ctr: `${item.ctr}`,
        paid: `${item.paid.toFixed(2)} ${currencyName}`,
        link: unitForId?.banner?.targetUrl
      }
    })
  }, [classes.icon, creatives, currencyName, units])

  if (!elements?.length) {
    return <div>No creatives found</div>
  }

  return <CustomTable background headings={headings} elements={elements} />
}

export default Creatives
