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

import InfoCurlyBorder from 'resources/icons/InfoCurlyBorder'

const InfoAlertMessage = ({ message }: { message: string }) => {
  // NOTE: just testing, need better color handle
  const theme = useMantineTheme()
  const parsedColor = parseThemeColor({ color: 'warning', theme })
  return (
    <Paper withBorder shadow="xs">
      <Group align="center">
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

        <Text size="sm">{message}</Text>
      </Group>
    </Paper>
  )
}

export default InfoAlertMessage
