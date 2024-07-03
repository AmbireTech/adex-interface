import { Grid, Text } from '@mantine/core'
import { useCallback, useRef } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useDropzone from 'hooks/useDropzone'
// import { isValidHttpUrl } from 'helpers/validators'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { adUnitsExtended, autoUTMChecked },
    removeAdUnit,
    addTargetURLToAdUnit,
    updateCampaign
  } = useCreateCampaignContext()

  const updateAutoUTMChecked = useCallback(
    (isChecked: boolean) => updateCampaign('autoUTMChecked', isChecked),
    [updateCampaign]
  )
  const debounceTimer = useRef<NodeJS.Timeout>()

  const { onDrop } = useDropzone()

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: AdUnit) => {
      removeAdUnit(file.id)
    },
    [removeAdUnit]
  )

  const handleOnInputChange = useCallback(
    (inputText: string, adUnitId: string) => {
      // const isValid = isValidHttpUrl(inputText)
      // if (!isValid) return

      if (debounceTimer.current) clearTimeout(debounceTimer.current)

      debounceTimer.current = setTimeout(() => {
        addTargetURLToAdUnit(inputText, adUnitId)
      }, 300)
    },
    [addTargetURLToAdUnit]
  )

  return (
    <Grid>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          3. Upload creatives
        </Text>
        <BannerSizesList adUnits={adUnitsExtended} />
        <FilesDropzone onDrop={onDrop} />
      </Grid.Col>

      {adUnitsExtended.length ? (
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
