import { Stack, Text, Code } from '@mantine/core'
import { useCallback } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useDropzone from 'hooks/useDropzone'
// import { isValidHttpUrl } from 'helpers/validators'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { adUnits, autoUTMChecked },
    removeAdUnit,
    addTargetURLToAdUnit,
    updateCampaign
  } = useCreateCampaignContext()

  const updateAutoUTMChecked = useCallback(
    (isChecked: boolean) => updateCampaign('autoUTMChecked', isChecked),
    [updateCampaign]
  )

  const { onDrop } = useDropzone()

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: AdUnit) => {
      removeAdUnit(file.id)
    },
    [removeAdUnit]
  )

  const handleOnInputChange = useCallback(
    (inputText: string, adUnitId: string) => {
      addTargetURLToAdUnit(inputText, adUnitId)
    },
    [addTargetURLToAdUnit]
  )

  return (
    <Stack>
      <Text c="secondaryText" size="sm" fw="bold" mb="xs">
        3. Upload creatives
      </Text>
      <BannerSizesList adUnits={adUnits} />
      <FilesDropzone onDrop={onDrop} />
      <Text size="xs">
        * uploading html banners requirements: <Code>.zip</Code> fille with index.html inside;
        <Code>index.html</Code> file need to include meta tag in format{' '}
        <Code>{'<meta name="ad.size" content="width=320,height=50">'}</Code>
      </Text>

      {adUnits.length ? (
        <UploadedBanners
          autoUTMChecked={autoUTMChecked}
          updateAutoUTMChecked={updateAutoUTMChecked}
          onDeleteCreativeBtnClicked={handleDeleteCreativeBtnClicked}
          handleOnInputChange={handleOnInputChange}
        />
      ) : null}
    </Stack>
  )
}

export default UploadCreative
