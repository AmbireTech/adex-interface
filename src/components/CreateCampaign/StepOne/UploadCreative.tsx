import { Grid, Text } from '@mantine/core'
import { useCallback, useRef, useState } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useDropzone from 'hooks/useDropzone'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { adUnits },
    updateCampaign
  } = useCreateCampaignContext()

  const [autoUTMChecked, setAutoUTMChecked] = useState(false)
  const updateAutoUTMChecked = useCallback((isChecked: boolean) => setAutoUTMChecked(isChecked), [])
  const debounceTimer = useRef<NodeJS.Timeout>()

  const { onDrop } = useDropzone()

  // TODO: add useMemo
  const hasUploadedCreatives = adUnits.length > 0

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: AdUnit) => {
      updateCampaign(
        'adUnits',
        adUnits.filter((item) => item.id !== file.id)
      )
    },
    [updateCampaign, adUnits]
  )

  // TODO: it's better to pass only the adUnit's id as a param, instead of the whole adUnit
  const handleOnInputChange = useCallback(
    (inputText: string, adUnitToUpdate: AdUnit) => {
      // TODO: Add validation here

      if (debounceTimer.current) clearTimeout(debounceTimer.current)

      debounceTimer.current = setTimeout(() => {
        const updated = [...adUnits]
        updated.forEach((element) => {
          const elCopy = { ...element }
          if (elCopy.id === adUnitToUpdate.id) elCopy.banner!.targetUrl = inputText
          return elCopy
        })
        updateCampaign('adUnits', updated)
      }, 300)
    },
    [updateCampaign, adUnits]
  )

  return (
    <Grid>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          2. Upload creatives
        </Text>
        <Text color="secondaryText" size="xs" weight="bold" mb="xs">
          Accepted banner sizes
        </Text>
        <BannerSizesList adUnits={adUnits} />
        <FilesDropzone onDrop={onDrop} />
      </Grid.Col>

      {hasUploadedCreatives ? (
        <Grid.Col>
          <UploadedBanners
            autoUTMChecked={autoUTMChecked}
            updateAutoUTMChecked={updateAutoUTMChecked}
            onDeleteCreativeBtnClicked={handleDeleteCreativeBtnClicked}
            handleOnInputChange={handleOnInputChange}
          />
        </Grid.Col>
      ) : null}
    </Grid>
  )
}

export default UploadCreative
