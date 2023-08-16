import CustomTable from 'components/common/CustomTable'
import { Flex, Image, createStyles } from '@mantine/core'
import UrlIcon from 'resources/icons/Url'
import { CreativePreviewModal } from 'components/common/Modals'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { ICreative } from 'types'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.brand[theme.fn.primaryShade()]
  },
  image: {
    cursor: 'pointer'
  }
}))

const Creatives = ({ creatives }: { creatives: ICreative[] | undefined }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const { classes } = useStyles()
  if (!creatives?.length) {
    return <div>No creatives found</div>
  }
  const headings = ['Media', 'Impressions', 'Clicks', 'CTR%', 'Spent']
  const [selectedMedia, setSelectedMedia] = useState('')
  const handleMediaClick = (media: string) => {
    setSelectedMedia(media)
    open()
  }
  const elements = creatives?.map((item) => {
    return {
      ...item,
      media: (
        <Flex align="center">
          <UrlIcon size="25px" className={classes.icon} />
          <Image
            ml="sm"
            src={item.media}
            maw="300px"
            onClick={() => handleMediaClick(item.media)}
            className={classes.image}
          />
        </Flex>
      ),
      impressions: item.impressions.toLocaleString(),
      clicks: item.clicks.toLocaleString(),
      ctrPercents: `${item.ctrPercents} %`
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
