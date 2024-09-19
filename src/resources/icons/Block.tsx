import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const ActiveIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      {...rest}
    >
      <g id="Block_icon" data-name="Block icon" transform="translate(3235 -9235)">
        <g
          id="shape"
          transform="translate(-3235 9235)"
          fill="none"
          stroke="#c90024"
          strokeWidth="1.5"
        >
          <circle cx="7" cy="7" r="7" stroke="none" />
          <circle cx="7" cy="7" r="6.25" fill="none" />
        </g>
        <line
          id="Line_348"
          data-name="Line 348"
          y1="9"
          x2="9"
          transform="translate(-3232.5 9237.5)"
          fill="none"
          stroke="#c90024"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}

ActiveIcon.defaultProps = defaultProps

export default ActiveIcon
