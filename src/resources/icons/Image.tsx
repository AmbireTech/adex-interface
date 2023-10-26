import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const ImageIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.808 21.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path
          d="M7.749 20.75h6c5 0 7-2 7-7v-6c0-5-2-7-7-7h-6c-5 0-7 2-7 7v6c0 5 2 7 7 7z"
          data-name="Path 2829"
        />
        <path d="M7.749 8.75a2 2 0 10-2-2 2 2 0 002 2z" data-name="Path 2830" />
        <path
          d="M1.42 17.7l4.93-3.31a2.253 2.253 0 012.64.14l.33.29a2.229 2.229 0 002.82 0l4.16-3.57a2.229 2.229 0 012.82 0l1.629 1.4"
          data-name="Path 2831"
        />
      </g>
    </svg>
  )
}

ImageIcon.defaultProps = defaultProps

export default ImageIcon
