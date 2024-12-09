import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DeleteIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 19.64 21.5"
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
        data-name="delete icon"
      >
        <path
          d="M18.82 4.73c-3.33-.33-6.68-.5-10.02-.5a59.068 59.068 0 00-5.94.3l-2.04.2"
          data-name="Path 2346"
        />
        <path
          d="M6.32 3.72l.22-1.31C6.7 1.46 6.82.75 8.51.75h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3"
          data-name="Path 2347"
        />
        <path
          d="M16.67 7.89l-.65 10.07c-.11 1.57-.2 2.79-2.99 2.79H6.61c-2.79 0-2.88-1.22-2.99-2.79L2.97 7.89"
          data-name="Path 2348"
        />
        <path d="M8.15 15.25h3.33" data-name="Path 2349" />
        <path d="M7.32 11.25h5" data-name="Path 2350" />
      </g>
    </svg>
  )
}

export default DeleteIcon
