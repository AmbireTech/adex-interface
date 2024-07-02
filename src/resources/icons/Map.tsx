import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const MapIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.21 18.931"
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
        data-name="map icon"
      >
        <path
          d="M.75 5.24v9.73c0 1.9 1.35 2.68 2.99 1.74l2.35-1.34a2.232 2.232 0 011.89-.05l5.25 2.63a2.268 2.268 0 001.89-.05l4.33-2.48a2.24 2.24 0 001.01-1.74V3.95c0-1.9-1.35-2.68-2.99-1.74l-2.35 1.34a2.232 2.232 0 01-1.89.05L7.98.98a2.268 2.268 0 00-1.89.05L1.76 3.51A2.21 2.21 0 00.75 5.24z"
          data-name="Path 3317"
        />
        <path d="M7.02 1.46v13" data-name="Path 3318" />
        <path d="M14.19 4.08v13.38" data-name="Path 3319" />
      </g>
    </svg>
  )
}

MapIcon.defaultProps = defaultProps

export default MapIcon
