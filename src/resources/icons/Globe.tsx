import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const GlobeIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  ...rest
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21.5 21.5"
      width={size}
      height={size}
      {...rest}
    >
      <g id="Globe_icon" data-name="Globe icon" transform="translate(-1.25 -1.25)">
        <path
          id="Path_9697"
          data-name="Path 9697"
          d="M12,22A10,10,0,1,0,2,12,10,10,0,0,0,12,22Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Path_9698"
          data-name="Path 9698"
          d="M8,3H9A28.424,28.424,0,0,0,9,21H8"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Path_9699"
          data-name="Path 9699"
          d="M15,3a28.424,28.424,0,0,1,0,18"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Path_9700"
          data-name="Path 9700"
          d="M3,16V15a28.424,28.424,0,0,0,18,0v1"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Path_9701"
          data-name="Path 9701"
          d="M3,9A28.424,28.424,0,0,1,21,9"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}

export default GlobeIcon
