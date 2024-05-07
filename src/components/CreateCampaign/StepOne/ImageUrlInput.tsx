import { ActionIcon, TextInput, Text } from '@mantine/core'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import MediaBanner from 'components/common/MediaBanner'
// import { isValidHttpUrl } from 'helpers/validators'
import { useCallback } from 'react'
import DeleteIcon from 'resources/icons/Delete'
import { ImageUrlInputProps } from 'types'

const ImageUrlInput = ({
  image,
  toRemove,
  onDelete,
  onChange,
  preview,
  ...rest
}: ImageUrlInputProps) => {
  // const [error, setError] = useState('')

  const getRightSection = useCallback(() => {
    if (preview)
      return <Text size="xs" pr="xs">{`${image.banner?.format.w}x${image.banner?.format.h}`}</Text>

    if (!onDelete) return null

    return (
      <ActionIcon
        title="Remove"
        color="secondaryText"
        variant="transparent"
        onClick={() => onDelete(image)}
      >
        <DeleteIcon size="24px" />
      </ActionIcon>
    )
  }, [image, preview, onDelete])

  // const validateField = useCallback((value: string) => {
  //   if (value.length === 0) {
  //     setError('Enter a target URL')
  //   } else if (!isValidHttpUrl(value)) {
  //     setError('Please enter a valid URL')
  //   } else {
  //     setError('')
  //   }
  // }, [])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // const { value } = event.target
      // validateField(value)

      // validateField()
      onChange?.(event)
    },
    [onChange]
  )

  return (
    <>
      {toRemove && <InfoAlertMessage message="The banner size does not meet the requirements." />}
      <TextInput
        onChange={handleChange}
        error={toRemove || (image.error !== '' && <Text size="sm">{image.error}</Text>)}
        disabled={toRemove || preview}
        defaultValue={image.banner?.targetUrl}
        onFocus={() => console.log('onFocus')}
        type="url"
        variant="default"
        placeholder="Please enter a target URL starting with https://"
        size="lg"
        icon={<MediaBanner adUnit={image} />}
        rightSection={getRightSection()}
        {...rest}
      />
    </>
  )
}

export default ImageUrlInput
