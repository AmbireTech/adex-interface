import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const InvisibilityIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 22.557 22.557"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path d="M13.864 8.694l-5.17 5.17a3.656 3.656 0 115.17-5.17z" data-name="Path 2277" />
        <path
          d="M17.226 4.913a9.841 9.841 0 00-5.947-2.084c-3.607 0-6.969 2.125-9.309 5.8a5.442 5.442 0 000 5.3 14.639 14.639 0 002.769 3.239"
          data-name="Path 2278"
        />
        <path
          d="M7.621 18.973a9.415 9.415 0 003.658.756c3.607 0 6.969-2.125 9.309-5.8a5.442 5.442 0 000-5.3 16.576 16.576 0 00-1.083-1.5"
          data-name="Path 2279"
        />
        <path d="M14.865 11.994a3.642 3.642 0 01-2.881 2.881" data-name="Path 2280" />
        <path d="M8.694 13.864l-7.633 7.633" data-name="Path 2281" />
        <path d="M21.497 1.061l-7.633 7.633" data-name="Path 2282" />
      </g>
    </svg>
  )
}

export default InvisibilityIcon
