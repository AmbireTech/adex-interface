import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const MobileIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 30 36.8"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path
          d="M28.6 9.9v17c0 6.8-1.7 8.5-8.5 8.5H9.9c-6.8 0-8.5-1.7-8.5-8.5v-17c0-6.8 1.7-8.5 8.5-8.5h10.2c6.8 0 8.5 1.7 8.5 8.5z"
          data-name="Path 2826"
        />
        <path d="M17.821 6.338h-5.643" data-name="Path 2827" />
        <path
          d="M15 31.308a2.187 2.187 0 10-2.187-2.187A2.187 2.187 0 0015 31.308z"
          data-name="Path 2828"
        />
      </g>
    </svg>
  )
}

MobileIcon.defaultProps = defaultProps

export default MobileIcon
