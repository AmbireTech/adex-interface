export interface AppIconProps {
  size?: string
  color?: string
  [x: string]: any
}

export const defaultProps: AppIconProps = {
  size: 'inherit',
  color: 'currentColor'
}
