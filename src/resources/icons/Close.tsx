import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const CloseIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g data-name="close button">
        <path
          d="M11.2 32h9.6c8 0 11.2-3.2 11.2-11.2v-9.6C32 3.2 28.8 0 20.8 0h-9.6C3.2 0 0 3.2 0 11.2v9.6C0 28.8 3.2 32 11.2 32z"
          fill="#efeef1"
          data-name="Path 2639"
        />
        <path
          d="M11.472 20.528l9.056-9.056"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          data-name="Path 2637"
        />
        <path
          d="M20.528 20.528l-9.056-9.056"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          data-name="Path 2638"
        />
      </g>
    </svg>
  )
}

export default CloseIcon
