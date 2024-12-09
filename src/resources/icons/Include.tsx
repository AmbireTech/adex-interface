import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const IncludeIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 13.5 13.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path d="M.75 6.75h12" data-name="Path 2857" />
        <path d="M6.75 12.75v-12" data-name="Path 2858" />
      </g>
    </svg>
  )
}

export default IncludeIcon
