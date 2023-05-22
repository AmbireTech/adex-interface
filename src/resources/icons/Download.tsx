import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DownloadIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
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
        data-name="download icon"
      >
        <path d="M7.75 9.75v6l2-2" data-name="Path 2425" />
        <path d="M7.75 15.75l-2-2" data-name="Path 2426" />
        <path
          d="M20.75 8.75v5c0 5-2 7-7 7h-6c-5 0-7-2-7-7v-6c0-5 2-7 7-7h5"
          data-name="Path 2427"
        />
        <path d="M20.75 8.75h-4c-3 0-4-1-4-4v-4z" data-name="Path 2428" />
      </g>
    </svg>
  )
}

DownloadIcon.defaultProps = defaultProps

export default DownloadIcon
