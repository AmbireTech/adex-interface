import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const ExcludeIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 13.5 1.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <path d="M.75.75h12" fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

ExcludeIcon.defaultProps = defaultProps

export default ExcludeIcon
