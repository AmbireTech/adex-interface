import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const InfoIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 21.5 21.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round">
        <path
          d="M10.75.75a10 10 0 11-10 10 10.029 10.029 0 0110-10z"
          strokeWidth={strokeWidth}
          data-name="Path 2668"
        />
        <path d="M10.75 14.75v-5" strokeWidth={strokeWidth} data-name="Path 2669" />
        <path d="M10.744 6.75h.006" strokeWidth="2" data-name="Path 2670" />
      </g>
    </svg>
  )
}

export default InfoIcon
