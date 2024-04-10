import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const AttentionIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 27.051 25.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round">
        <path d="M13.524 8.918v6.374" strokeWidth="1.5" data-name="Path 3124" />
        <path
          d="M13.526 24.737H5.801c-4.423 0-6.272-3.161-4.13-7.024l3.977-7.164 3.748-6.731c2.269-4.092 5.991-4.092 8.26 0l3.748 6.739 3.975 7.169c2.142 3.862.28 7.024-4.13 7.024h-7.723z"
          strokeWidth="1.5"
          data-name="Path 3125"
        />
        <path d="M13.526 19.116h.011" strokeWidth={strokeWidth} data-name="Path 3126" />
      </g>
    </svg>
  )
}

AttentionIcon.defaultProps = defaultProps

export default AttentionIcon
