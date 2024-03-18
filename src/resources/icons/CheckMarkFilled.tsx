import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const CheckMarkFilledIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g data-name="Group 1868">
        <path
          d="M10 20A10 10 0 100 10a10.029 10.029 0 0010 10z"
          fill="#2c5cde"
          data-name="Path 3289"
        />
        <path
          d="M5.75 10l2.83 2.83 5.67-5.66"
          fill={color}
          stroke="white"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          data-name="Path 3290"
        />
      </g>
    </svg>
  )
}

CheckMarkFilledIcon.defaultProps = defaultProps

export default CheckMarkFilledIcon
