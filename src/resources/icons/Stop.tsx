import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const StopIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  ...rest
}) => {
  return (
    <svg viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...rest}>
      <path
        d="M3.299 8.5h2.4c2 0 2.8-.8 2.8-2.8V3.3c0-2-.8-2.8-2.8-2.8h-2.4c-2 0-2.8.8-2.8 2.8v2.4c0 2 .8 2.8 2.8 2.8z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        data-name="stoped icon"
      />
    </svg>
  )
}

export default StopIcon
