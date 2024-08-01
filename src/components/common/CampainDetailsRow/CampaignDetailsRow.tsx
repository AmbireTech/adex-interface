import { Flex, Text, createStyles } from '@mantine/core'
import { CampaignDetailsRowProps } from 'types'

const useStyles = createStyles((theme, { lighterColor }: { lighterColor: boolean }) => ({
  border: {
    borderBottom: `1px dashed ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`
  },
  textColor: {
    color: !lighterColor
      ? theme.colors.secondaryText[theme.fn.primaryShade()]
      : theme.colors.secondaryText[theme.fn.primaryShade()] +
        theme.other.shades.hexColorSuffix.lighter
  }
}))

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
      <Text span weight="bold" size={textSize} color="secondaryText">
        {title}
      </Text>
      {typeof value === 'string' ? (
        <Text align="end" span={!column} w={column ? '100%' : 'auto'}>
          {value}
        </Text>
      ) : (
        value
      )}
    </Flex>
  )
}

export default CampaignDetailsRow
