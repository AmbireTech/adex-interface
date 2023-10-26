export interface AppIconProps {
  size?: string
  color?: string
  strokeWidth?: string
  [x: string]: any
}

export const defaultProps: AppIconProps = {
  size: '36px',
  color: 'currentColor',
  strokeWidth: '1.5'
}
