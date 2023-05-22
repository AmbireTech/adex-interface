import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const RightChevronIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.5 21.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
        data-name="right chevron"
      >
        <path
          d="M20.75 13.751v-6c0-5-2-7-7-7h-6c-5 0-7 2-7 7v6c0 5 2 7 7 7h6c5 0 7-2 7-7z"
          data-name="Path 2883"
        />
        <path d="M9.39 14.279l3.52-3.528-3.52-3.53" data-name="Path 2884" />
      </g>
    </svg>
  )
}

RightChevronIcon.defaultProps = defaultProps

export default RightChevronIcon
