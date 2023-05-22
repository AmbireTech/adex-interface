import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const AttentionIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.726 21.699"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round">
        <path
          d="M9.612 1.315a2 2 0 012.51 0l1.58 1.35a2.31 2.31 0 001.27.46h1.7a1.938 1.938 0 011.93 1.93v1.7a2.279 2.279 0 00.46 1.26l1.35 1.58a2 2 0 010 2.51l-1.35 1.58a2.279 2.279 0 00-.46 1.26v1.7a1.938 1.938 0 01-1.93 1.93h-1.7a2.279 2.279 0 00-1.26.46l-1.58 1.35a2 2 0 01-2.51 0l-1.58-1.35a2.307 2.307 0 00-1.26-.46h-1.75a1.938 1.938 0 01-1.93-1.93v-1.71a2.237 2.237 0 00-.45-1.25l-1.35-1.59a2.013 2.013 0 010-2.5l1.35-1.59a2.264 2.264 0 00.45-1.25v-1.69a1.938 1.938 0 011.93-1.93h1.73a2.279 2.279 0 001.26-.46z"
          strokeWidth="1.5"
          data-name="Path 2909"
        />
        <path d="M10.862 6.995v4.83" strokeWidth="1.5" data-name="Path 2910" />
        <path d="M10.856 14.865h.006" strokeWidth="2" data-name="Path 2911" />
      </g>
    </svg>
  )
}

AttentionIcon.defaultProps = defaultProps

export default AttentionIcon
