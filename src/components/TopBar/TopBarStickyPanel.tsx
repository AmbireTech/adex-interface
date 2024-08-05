import { Box, BoxComponentProps } from '@mantine/core'
import { PropsWithChildren } from 'react'

export const StickyPanel = ({ children, ...boxprops }: PropsWithChildren & BoxComponentProps) => {
  return (
    <Box style={{ position: 'sticky', top: 90, zIndex: 2 }} {...boxprops}>
      {children}
    </Box>
  )
}
