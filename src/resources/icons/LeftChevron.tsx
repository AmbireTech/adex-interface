import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const LeftChevronIcon: React.FC<AppIconProps> = ({
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
        data-name="left chevron"
      >
        <path
          d="M.75 7.749v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-6c0-5-2-7-7-7h-6c-5 0-7 2-7 7z"
          data-name="Path 2883"
        />
        <path d="M12.11 7.221l-3.52 3.528 3.52 3.53" data-name="Path 2884" />
      </g>
    </svg>
  )
}

export default LeftChevronIcon
