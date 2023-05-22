import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const BellIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 17.565 21.62"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeWidth="1.5">
        <path
          d="M8.806 1.72a6 6 0 00-6 6v2.89a4.778 4.778 0 01-.57 2.06l-1.15 1.91a1.919 1.919 0 001.08 2.93 20.921 20.921 0 0013.27 0 2 2 0 001.08-2.93l-1.15-1.91a4.91 4.91 0 01-.56-2.06V7.72a6.018 6.018 0 00-6-6z"
          strokeLinecap="round"
          data-name="Path 2260"
        />
        <path
          d="M10.656 2.01a6.054 6.054 0 00-.96-.2 6.754 6.754 0 00-2.74.2 1.988 1.988 0 013.7 0z"
          strokeLinecap="round"
          data-name="Path 2261"
        />
        <path d="M11.806 17.87a3 3 0 01-6 0" data-name="Path 2262" />
      </g>
    </svg>
  )
}

BellIcon.defaultProps = defaultProps

export default BellIcon
