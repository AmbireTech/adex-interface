import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const HelpIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none">
        <path
          d="M13 18.714v-5m0 0a5.724 5.724 0 001.429-.18m-1.429.18a5.724 5.724 0 01-1.429-.18m3.571 7.122a11.547 11.547 0 01-4.286 0m3.571 2.269a13.773 13.773 0 01-2.857 0m3.571-4.211v-.183a2.651 2.651 0 011.437-2.206 7.143 7.143 0 10-7.159 0 2.651 2.651 0 011.438 2.207v.183"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
        <path d="M0 0h26v26H0z" data-name="Rectangle 341" />
      </g>
    </svg>
  )
}

HelpIcon.defaultProps = defaultProps

export default HelpIcon
