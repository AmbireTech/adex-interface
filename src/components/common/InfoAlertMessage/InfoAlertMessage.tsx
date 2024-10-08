import {
  Text,
  Box,
  Paper,
  Group,
  ThemeIcon,
  Center,
  lighten,
  parseThemeColor,
  useMantineTheme
} from '@mantine/core'
import { ReactNode } from 'react'

import InfoCurlyBorder from 'resources/icons/InfoCurlyBorder'

const InfoAlertMessage = ({ message }: { message: ReactNode }) => {
  // NOTE: just testing, need better color handle
  const theme = useMantineTheme()
  const parsedColor = parseThemeColor({ color: 'warning', theme })
  return (
    <Paper withBorder shadow="xs">
      <Group align="center" wrap="nowrap">
        <Box
          p="sm"
          bg={lighten(
            parsedColor.isThemeColor ? `var(${parsedColor.variable})` : parsedColor.value,
            theme.other.shades.lighten.lightest
          )}
        >
          <Center>
            <ThemeIcon variant="transparent" color="warning">
              <InfoCurlyBorder size="24px" />
            </ThemeIcon>
          </Center>
        </Box>

        <Text size="sm" span>
          {message?.toString()}
        </Text>
      </Group>
    </Paper>
  )
}

export default InfoAlertMessage
