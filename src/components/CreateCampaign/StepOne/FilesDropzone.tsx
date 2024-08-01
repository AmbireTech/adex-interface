import { Group, Text } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { useCallback, useState } from 'react'
import HtmlIcon from 'resources/icons/Html'
import ImageIcon from 'resources/icons/Image'
import { FileWithPath } from 'types'

type FilesDropzoneProps = {
  onDrop: (files: FileWithPath[]) => void
}

const FilesDropzone = ({ onDrop }: FilesDropzoneProps) => {
  const [rejectedFiles, setRejectedFiles] = useState<any[]>([])
  const handleOnDrop = useCallback(
    (files: FileWithPath[]) => {
      setRejectedFiles([])
      onDrop(files)
    },
    [onDrop]
  )
  return (
    <Dropzone
      mt="md"
      onDrop={handleOnDrop}
      onReject={(files: any) => {
        setRejectedFiles(files)
        console.log('rejected files', files)
      }}
      maxSize={1042069}
      accept={{
        'image/*': ['.jpeg', '.jpg', '.png'],
        'video/*': ['.mp4'],
        'application/zip': ['.zip']
      }}
    >
      <Group align="center" justify="center" p="sm" style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          {/* <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-blue-6)'
              }}
              stroke={1.5}
            /> */}
        </Dropzone.Accept>
        <Dropzone.Reject>
          {/* <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-red-6)'
              }}
              stroke={1.5}
            /> */}
        </Dropzone.Reject>
        <Dropzone.Idle>
          {/* <ImageIcon
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-dimmed)'
              }}
              stroke={1.5}
            /> */}
        </Dropzone.Idle>
        <div>
          <Group justify="center" mb="sm">
            <ImageIcon size="20px" />
            <HtmlIcon size="20px" />
          </Group>
          <Text size="sm" inline>
            Drop your file(s) here, or upload from your device.
          </Text>
          <Text size="xs" c="dimmed" inline mt={7}>
            Accepted format: jpeg, png and for html banners zip file. Max size: 1MB.
          </Text>
          {rejectedFiles.length > 0 && (
            <Text size="xs" c="red" inline mt={7}>
              Rejected files: {rejectedFiles[0].errors[0].message}
            </Text>
          )}
        </div>
      </Group>
    </Dropzone>
  )
}

export default FilesDropzone
