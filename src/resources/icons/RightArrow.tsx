import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const RightArrowIcon: React.FC<AppIconProps> = ({
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
        data-name="right arrow"
      >
        <path d="M.749 5.101h15.535" data-name="Path 2627" />
        <path d="M13.594 1.061l4.04 4.04-4.04 4.04" data-name="Path 2628" />
      </g>
    </svg>
  )
}

export default RightArrowIcon
