import { Anchor, AnchorProps, createStyles } from '@mantine/core'
import Url from 'resources/icons/Url'
import { ICustomAnchor, ICustomAnchorStylesProps } from 'types'

export const useStyles = createStyles((theme, { color }: ICustomAnchorStylesProps) => ({
  externalIcon: {
    marginLeft: theme.spacing.sm
  },
  fontColor: {
    color: theme.colors[color][theme.fn.primaryShade()]
  }
}))

const getUrl = (u: string) => {
  let url = (u || '').replace(/^(https?:)?\/\//i, '')
  if (url) {
    url = `//${url}`
  }

  return url
}

const CustomAnchor = ({
  href,
  target,
  externalIcon,
  color,
  className,
  children,
  isExternal,
  ...rest
}: ICustomAnchor) => {
  const { classes, cx } = useStyles({ color })
  const url = isExternal ? getUrl(href) : href
  const linkProps: AnchorProps = {
    color,
    ...(isExternal && { rel: 'noopener noreferrer' }),
    ...rest
  }
  return (
    <Anchor target={target} href={url} className={cx(className, classes.fontColor)} {...linkProps}>
      {children}
      {/* TODO: change the icon with "OpenInNew" icon "URL" icon is temp */}
      {externalIcon && <Url className={classes.externalIcon} />}
    </Anchor>
  )
}

export const ExternalAnchor = ({
  href,
  children,
  color,
  externalIcon,
  isExternal,
  target,
  ...rest
}: ICustomAnchor) => (
  <CustomAnchor
    target={target}
    color={color}
    externalIcon={externalIcon}
    href={href}
    {...rest}
    isExternal
  >
    {children}
  </CustomAnchor>
)

export default CustomAnchor
