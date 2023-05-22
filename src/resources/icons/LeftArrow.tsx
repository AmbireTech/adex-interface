import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const LeftArrowIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 18.384 10.202"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5" data-name="left arrow">
        <path d="M17.634 5.101H2.099" data-name="Path 2627" />
        <path d="M4.791 1.061l-4.04 4.04 4.04 4.04" data-name="Path 2628" />
      </g>
    </svg>
  )
}

LeftArrowIcon.defaultProps = defaultProps

export default LeftArrowIcon
