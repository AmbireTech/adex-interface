import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const CheckMarkIcon: React.FC<AppIconProps> = ({
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
      <g stroke={color} strokeLinecap="round" strokeWidth={strokeWidth} data-name="Group 1871">
        <path
          d="M10.75 20.75a10 10 0 10-10-10 10.029 10.029 0 0010 10z"
          fill="none"
          data-name="Path 3289"
        />
        <path d="M6.5 10.75l2.83 2.83L15 7.92" fill="rgba(0,0,0,0)" data-name="Path 3290" />
      </g>
    </svg>
  )
}

export default CheckMarkIcon
