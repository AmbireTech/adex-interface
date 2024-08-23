import { Group, Text, Stack, ThemeIcon } from '@mantine/core'
import { Dropzone, FileRejection, MIME_TYPES } from '@mantine/dropzone'
import useDropzone from 'hooks/useDropzone'
import { useCallback, useState } from 'react'
import HtmlIcon from 'resources/icons/Html'
import ImageIcon from 'resources/icons/Image'
import BlockIcon from 'resources/icons/Block'
import { FileWithPath } from 'types'
import IncludeIcon from 'resources/icons/Include'

const FilesDropzone = () => {
  const { onDrop, isLoading } = useDropzone()
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])
  const handleOnDrop = useCallback(
    (files: FileWithPath[]) => {
      setRejectedFiles([])
      onDrop(files)
    },
    [onDrop]
  )
  return (
    <Dropzone
      acceptColor="success"
      rejectColor="warning"
      variant="light"
      loading={isLoading}
      onDrop={handleOnDrop}
      onReject={(files: FileRejection[]) => {
        setRejectedFiles(files)
      }}
      maxSize={1042069}
      accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.mp4, MIME_TYPES.zip]}
    >
      <Stack gap="xs" justify="center" align="center">
        <Group justify="center">
          <Dropzone.Accept>
            <ThemeIcon size="md" color="success" variant="transparent">
              <IncludeIcon />
            </ThemeIcon>
          </Dropzone.Accept>
          <Dropzone.Reject>
            <ThemeIcon size="md" variant="transparent">
              <BlockIcon />
            </ThemeIcon>
          </Dropzone.Reject>
          <Dropzone.Idle>
            <Group gap="lg" p="0">
              <ThemeIcon size="md" color="mainText" variant="transparent">
                <ImageIcon />
              </ThemeIcon>
              <ThemeIcon size="md" color="mainText" variant="transparent">
                <HtmlIcon />
              </ThemeIcon>
            </Group>
          </Dropzone.Idle>
        </Group>
        <Text size="sm">Drop your file(s) here, or upload from your device.</Text>
        <Text size="xs" c="dimmed">
          Accepted format: jpeg, png and for html banners zip file. Max size: 1MB.
        </Text>
        {rejectedFiles?.map((rf) => (
          <Text size="xs" c="warning">
            Rejected: {rf.file.name} - {rf.errors?.map((x) => x.message).join(', ')}
          </Text>
        ))}
      </Stack>
    </Dropzone>
  )
}

export default FilesDropzone
