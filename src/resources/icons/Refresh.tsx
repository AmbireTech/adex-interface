import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const RefreshIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.779 21.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <path
        d="M20.748 10.75a10 10 0 01-10 10c-5.52 0-8.89-5.56-8.89-5.56m0 0h4.52m-4.52 0v5m-1.11-9.44a9.978 9.978 0 0110-10 12.3 12.3 0 0110 5.56m0 0v-5m0 5h-4.44"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

RefreshIcon.defaultProps = defaultProps

export default RefreshIcon
