import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const TimeIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 24.057 25.861"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        data-name="Time icon"
      >
        <path d="M20.75 10.75a10 10 0 11-10-10 10 10 0 0110 10z" data-name="Path 2897" />
        <path d="M14.46 13.93l-3.1-1.85a2.215 2.215 0 01-.98-1.72v-4.1" data-name="Path 2898" />
      </g>
    </svg>
  )
}

TimeIcon.defaultProps = defaultProps

export default TimeIcon
