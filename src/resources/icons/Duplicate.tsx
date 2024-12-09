import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DuplicateIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
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
        strokeWidth={strokeWidth}
        data-name="duplicate icon"
      >
        <path
          d="M15.75 12.15v3c0 4-1.6 5.6-5.6 5.6h-3.8c-4 0-5.6-1.6-5.6-5.6v-3.8c0-4 1.6-5.6 5.6-5.6h3"
          data-name="Path 2195"
        />
        <path d="M15.75 12.15h-3.2c-2.4 0-3.2-.8-3.2-3.2v-3.2z" data-name="Path 2196" />
        <path d="M10.35.75h4" data-name="Path 2197" />
        <path d="M5.75 3.75a3 3 0 013-3h2.62" data-name="Path 2198" />
        <path d="M20.75 6.75v6.19a2.812 2.812 0 01-2.81 2.81" data-name="Path 2199" />
        <path d="M20.75 6.75h-3c-2.25 0-3-.75-3-3v-3z" data-name="Path 2200" />
      </g>
    </svg>
  )
}

export default DuplicateIcon
