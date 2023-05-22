import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DownArrowIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 10.519 6.01"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g data-name="down arrow">
        <path
          d="M9.459 1.061l-4.2 4.2-4.2-4.2"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="1.5"
          data-name="Path 2653"
        />
      </g>
    </svg>
  )
}

DownArrowIcon.defaultProps = defaultProps

export default DownArrowIcon
