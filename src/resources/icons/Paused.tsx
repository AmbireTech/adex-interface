import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const PausedIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...rest}>
      <g data-name="paused icon">
        <g fill="none" stroke={color} strokeLinecap="round" data-name="Group 1873">
          <path
            d="M3.499 7.66V1.34c0-.6-.222-.84-.787-.84H1.289c-.565 0-.79.24-.79.84v6.32c0 .6.224.84.788.84h1.425c.565 0 .787-.24.787-.84z"
            data-name="Path 3292"
          />
          <path
            d="M8.5 7.66V1.34c0-.6-.224-.84-.789-.84H6.286c-.561 0-.789.24-.789.84v6.32c0 .6.224.84.789.84h1.425c.565 0 .789-.24.789-.84z"
            data-name="Path 3293"
          />
        </g>
      </g>
    </svg>
  )
}

PausedIcon.defaultProps = defaultProps

export default PausedIcon
