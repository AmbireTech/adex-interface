import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const HtmlIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 19.316 21.495"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5" data-name="html icon">
        <path
          d="M1.75.75h15.8a.972.972 0 011 1.1l-1.8 16.2a1.068 1.068 0 01-.7.9l-6.1 1.7a.446.446 0 01-.5 0l-6.1-1.7a.876.876 0 01-.7-.9L.75 1.85a1.028 1.028 0 011-1.1z"
          data-name="Path 2847"
        />
        <path d="M13.85 5.55h-8.4l.4 4.4h7.6l-.6 5-3.4 1-3.6-1v-2" data-name="Path 2848" />
      </g>
    </svg>
  )
}

HtmlIcon.defaultProps = defaultProps

export default HtmlIcon
