import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const LeftArrowIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 18.384 10.202"
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
        data-name="left arrow"
      >
        <path d="M17.634 5.101H2.099" data-name="Path 2627" />
        <path d="M4.791 1.061l-4.04 4.04 4.04 4.04" data-name="Path 2628" />
      </g>
    </svg>
  )
}

export default LeftArrowIcon
