import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const UrlIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 19.682 11.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path
          d="M12.857 10.75h1.308a4.9 4.9 0 004.766-5 4.9 4.9 0 00-4.766-5h-1.308"
          data-name="Path 2870"
        />
        <path
          d="M6.816.75h-1.3a4.9 4.9 0 00-4.768 5 4.9 4.9 0 004.766 5h1.3"
          data-name="Path 2871"
        />
        <path d="M6.373 5.75h6.932" data-name="Path 2872" />
      </g>
    </svg>
  )
}

export default UrlIcon
