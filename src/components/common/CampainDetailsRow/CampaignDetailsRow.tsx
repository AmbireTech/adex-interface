import { Flex, MantineTheme, Text, getPrimaryShade, lighten } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { CampaignDetailsRowProps } from 'types'

const useStyles = createStyles(
  (theme: MantineTheme, { lighterColor }: { lighterColor: boolean }) => {
    const colorScheme = useColorScheme()
    const primaryShade = getPrimaryShade(theme, colorScheme)

    return {
      border: {
        borderBottom: `1px dashed ${theme.colors.decorativeBorders[primaryShade]}`
      },
      textColor: {
        color: !lighterColor
          ? theme.colors.secondaryText[primaryShade]
          : lighten(theme.colors.secondaryText[primaryShade], theme.other.shades.lighten.lighter)
      }
    }
  }
)

const CampaignDetailsRow = ({
  title,
  value,
  lighterColor,
  textSize = 'md',
  noBorder = false,
  column = false,
  lineHeight = 'md',
  ...rest
}: CampaignDetailsRowProps) => {
  const { classes, cx } = useStyles({ lighterColor: !!lighterColor })
  return (
    <Flex
      direction={column ? 'column' : 'row'}
      justify={column ? 'center' : 'space-between'}
      align={column ? 'stretch' : 'center'}
      className={cx({ [classes.border]: !noBorder })}
      pt={lineHeight}
      pb={lineHeight}
      gap="xs"
      {...rest}
    >
      <Text span fw="bold" size={textSize}>
        {title}
      </Text>
      {typeof value === 'string' ? (
        <Text ta="end" span={!column} w={column ? '100%' : 'auto'}>
          {value}
        </Text>
      ) : (
        value
      )}
    </Flex>
  )
}

export default CampaignDetailsRow
