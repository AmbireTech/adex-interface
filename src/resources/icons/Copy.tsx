import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const CopyIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 25.5 25.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5" data-name="Copy icon">
        <path
          d="M17.55 13.83v5.04c0 4.2-1.68 5.88-5.88 5.88H6.63c-4.2 0-5.88-1.68-5.88-5.88v-5.04c0-4.2 1.68-5.88 5.88-5.88h5.04c4.2 0 5.88 1.68 5.88 5.88z"
          data-name="Path 2666"
        />
        <path
          d="M24.75 6.63v5.04c0 4.2-1.68 5.88-5.88 5.88h-1.32v-3.72c0-4.2-1.68-5.88-5.88-5.88H7.95V6.63c0-4.2 1.68-5.88 5.88-5.88h5.04c4.2 0 5.88 1.68 5.88 5.88z"
          data-name="Path 2667"
        />
      </g>
    </svg>
  )
}

CopyIcon.defaultProps = defaultProps

export default CopyIcon
