import { Group, Text } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import HtmlIcon from 'resources/icons/Html'
import ImageIcon from 'resources/icons/Image'
import { FileWithPath } from 'types'

type FilesDropzoneProps = {
  onDrop: (files: FileWithPath[]) => void
}

const FilesDropzone = ({ onDrop }: FilesDropzoneProps) => {
  return (
    <Dropzone
      mt="md"
      onDrop={onDrop}
      onReject={(files: any) => console.log('rejected files', files)}
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
    >
      <Group align="center" position="center" p="sm" style={{ pointerEvents: 'none' }}>
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
          <Group position="center" mb="sm">
            <ImageIcon size="20px" />
            <HtmlIcon size="20px" />
          </Group>

          <Text size="sm" inline>
            Drop your file(s) here, or upload from your device.
          </Text>
          <Text size="xs" c="dimmed" inline mt={7}>
            Accepted format: jpeg, png and for html banners zip file.
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}

export default FilesDropzone
