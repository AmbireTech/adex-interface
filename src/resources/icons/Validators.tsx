import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const ValidatorsIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 18.7 21.737"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path
          d="M7.83 1.031l-4.99 1.88a3.47 3.47 0 00-2.09 3.01v7.43a4.862 4.862 0 001.73 3.44l4.3 3.21a4.552 4.552 0 005.14 0l4.3-3.21a4.862 4.862 0 001.73-3.44v-7.43a3.472 3.472 0 00-2.09-3.02l-4.99-1.87a5.085 5.085 0 00-3.04 0z"
          data-name="Path 2324"
        />
        <path d="M6.39 10.671L8 12.281l4.3-4.3" data-name="Path 2325" />
      </g>
    </svg>
  )
}

export default ValidatorsIcon
