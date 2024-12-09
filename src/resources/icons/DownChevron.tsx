import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DownChevronIcon: React.FC<AppIconProps> = ({
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
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        data-name="down chevron"
      >
        <path
          d="M7.749 20.75h6c5 0 7-2 7-7v-6c0-5-2-7-7-7h-6c-5 0-7 2-7 7v6c0 5 2 7 7 7z"
          data-name="Path 2883"
        />
        <path d="M7.221 9.39l3.528 3.52 3.53-3.52" data-name="Path 2884" />
      </g>
    </svg>
  )
}

export default DownChevronIcon
