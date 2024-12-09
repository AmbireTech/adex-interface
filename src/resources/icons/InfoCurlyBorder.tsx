import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const InfoCurlyBorder: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 26.293 26.301"
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
        data-name="Group 1096"
      >
        <path
          d="M11.644 1.684a2.4 2.4 0 013.014 0l1.9 1.624a2.771 2.771 0 001.525.553h2.041a2.328 2.328 0 012.314 2.321v2.045a2.744 2.744 0 00.552 1.515l1.621 1.9a2.41 2.41 0 010 3.019l-1.621 1.9a2.744 2.744 0 00-.552 1.515v2.045a2.328 2.328 0 01-2.317 2.323H18.08a2.734 2.734 0 00-1.513.553l-1.9 1.624a2.4 2.4 0 01-3.014 0l-1.9-1.624a2.767 2.767 0 00-1.513-.553h-2.1a2.328 2.328 0 01-2.317-2.321v-2.059a2.693 2.693 0 00-.54-1.5l-1.618-1.92a2.425 2.425 0 010-3.007l1.621-1.912a2.726 2.726 0 00.54-1.5V6.194a2.328 2.328 0 012.317-2.321H8.22a2.734 2.734 0 001.513-.553z"
          data-name="Path 2909"
        />
        <path d="M13.145 8.515v5.809" data-name="Path 2910" />
        <path d="M13.137 17.98h.011" data-name="Path 2911" />
      </g>
    </svg>
  )
}

export default InfoCurlyBorder
