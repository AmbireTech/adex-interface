import CustomTable from 'components/common/CustomTable'
import { Flex, Image, createStyles } from '@mantine/core'
import UrlIcon from 'resources/icons/Url'
import { CreativePreviewModal } from 'components/common/Modals'
import { useCallback, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { BaseAnalyticsData } from 'types'
import { formatCurrency } from 'helpers'
import { AdUnit } from 'adex-common'
import { getMediaUrlWithProvider } from 'helpers/createCampaignHelpers'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.brand[theme.fn.primaryShade()]
  },
  image: {
    cursor: 'pointer'
  }
}))

const Creatives = ({
  creatives,
  units,
  currencyName
}: {
  creatives: BaseAnalyticsData[] | undefined
  units: AdUnit[] | undefined
  currencyName: string
}) => {
  const [opened, { open, close }] = useDisclosure(false)
  const { classes } = useStyles()

  const headings = ['Media', 'Size', 'Impressions', 'Clicks', 'CTR%', 'Spent', 'Link']
  const [selectedMedia, setSelectedMedia] = useState('')
  const handleMediaClick = useCallback(
    (media: string) => {
      setSelectedMedia(media)
      open()
    },
    [open]
  )

  if (!creatives?.length || !units?.length) {
    return <div>No creatives found</div>
  }

  const elements = creatives?.map((item) => {
    const unitForId = units.find((x) => x.id === item.segment)
    const media = getMediaUrlWithProvider(unitForId?.banner?.mediaUrl, IPFS_GATEWAY) || ''

    return {
      media: (
        <Flex align="center">
          <UrlIcon size="25px" className={classes.icon} />
          <Image
            ml="sm"
            src={media}
            mah="100px"
            maw="50px"
            onClick={() => handleMediaClick(media || '')}
            className={classes.image}
          />
        </Flex>
      ),
      size: unitForId?.banner
        ? `${unitForId?.banner?.format.w}x${unitForId?.banner?.format.w}`
        : '',
      impressions: formatCurrency(item.impressions, 0),
      clicks: formatCurrency(item.clicks, 0),
      ctr: `${item.ctr} %`,
      paid: `${item.paid} ${currencyName}`,
      link: unitForId?.banner?.targetUrl
    }
  })
  return (
    <>
      <CustomTable background headings={headings} elements={elements} />
      <CreativePreviewModal media={selectedMedia} opened={opened} close={close} />
    </>
  )
}

export default Creatives
