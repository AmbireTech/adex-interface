import { Anchor, AnchorProps, createStyles } from '@mantine/core'
import Url from 'resources/icons/Url'
import { ICustomAnchor } from 'types'

export const useStyles = createStyles((theme) => ({
  externalIcon: {
    marginLeft: theme.spacing.sm
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center'
  },
  fullWidth: {
    width: '100%'
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
  children,
  label,
  underline,
  externalIcon,
  color,
  component,
  className,
  fullWidth,
  ...rest
}: ICustomAnchor) => {
  const { classes, cx } = useStyles()
  const isExternal = target && target === '_blank'
  const url = isExternal ? getUrl(href) : href
  const linkProps: AnchorProps = {
    underline,
    color: color || 'inherit',
    ...(isExternal && { rel: 'noopener noreferrer' }),
    style: { wordBreak: 'break-all' },
    ...(component ? { component } : {}),
    ...rest
  }
  return (
    <Anchor
      target={target}
      href={url}
      {...linkProps}
      className={cx(className, classes.link, {
        [classes.fullWidth]: !!fullWidth
      })}
    >
      {!component && (children || label)}
      {/* TODO: change the icon with "OpenInNew" icon "URL" icon is temp */}
      {!component && externalIcon && <Url className={classes.externalIcon} />}
    </Anchor>
  )
}

export const ExternalAnchor = ({
  href,
  children,
  style,
  color,
  externalIcon,
  ...rest
}: ICustomAnchor) => (
  <CustomAnchor
    target="_blank"
    color={color}
    externalIcon={externalIcon}
    style={style}
    href={href}
    {...rest}
  >
    {children}
  </CustomAnchor>
)

export default CustomAnchor
