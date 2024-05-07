import { Grid, Text } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useDropzone from 'hooks/useDropzone'
// import { isValidHttpUrl } from 'helpers/validators'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { adUnitsExtended },
    updateCampaign
  } = useCreateCampaignContext()

  const [autoUTMChecked, setAutoUTMChecked] = useState(false)
  const updateAutoUTMChecked = useCallback((isChecked: boolean) => setAutoUTMChecked(isChecked), [])
  // const debounceTimer = useRef<NodeJS.Timeout>()

  const { onDrop } = useDropzone()

  const hasUploadedCreatives = useMemo(() => adUnitsExtended.length > 0, [adUnitsExtended.length])

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: AdUnit) => {
      updateCampaign(
        'adUnitsExtended',
        adUnitsExtended.filter((item) => item.id !== file.id)
      )
      URL.revokeObjectURL(file.banner?.mediaUrl || '')
    },
    [updateCampaign, adUnitsExtended]
  )

  // const handleOnInputChange = useCallback(
  //   (inputText: string, adUnitId: string) => {
  //     // const isValid = isValidHttpUrl(inputText)
  //     // if (!isValid) return

  //     if (debounceTimer.current) clearTimeout(debounceTimer.current)

  //     debounceTimer.current = setTimeout(() => {
  //       const updated = [...adUnits]
  //       updated.forEach((element) => {
  //         const elCopy = { ...element }
  //         if (elCopy.id === adUnitId) elCopy.banner!.targetUrl = inputText
  //         return elCopy
  //       })
  //       updateCampaign('adUnits', updated)
  //     }, 300)
  //   },
  //   [updateCampaign, adUnits]
  // )

  return (
    <Grid>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          3. Upload creatives
        </Text>
        <Text color="secondaryText" size="xs" weight="bold" mb="xs">
          Accepted banner sizes
        </Text>
        <BannerSizesList adUnits={adUnitsExtended} />
        <FilesDropzone onDrop={onDrop} />
      </Grid.Col>

      {hasUploadedCreatives ? (
        <Grid.Col>
          <UploadedBanners
            autoUTMChecked={autoUTMChecked}
            updateAutoUTMChecked={updateAutoUTMChecked}
            onDeleteCreativeBtnClicked={handleDeleteCreativeBtnClicked}
            // handleOnInputChange={handleOnInputChange}
          />
        </Grid.Col>
      ) : null}
    </Grid>
  )
}

export default UploadCreative
