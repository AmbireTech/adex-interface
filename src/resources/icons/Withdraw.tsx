import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const WithdrawIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.811 18.5"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path d="M.75 5.749h12.5" data-name="Path 2959" />
        <path d="M4.75 13.749h2" data-name="Path 2960" />
        <path d="M9.25 13.749h4" data-name="Path 2961" />
        <path
          d="M20.75 11.281v2.08c0 3.51-.89 4.39-4.44 4.39H5.19c-3.55 0-4.44-.88-4.44-4.39v-8.22c0-3.51.89-4.39 4.44-4.39h8.06"
          data-name="Path 2962"
        />
        <path d="M18.75.749v6l2-2" data-name="Path 2963" />
        <path d="M18.75 6.749l-2-2" data-name="Path 2964" />
      </g>
    </svg>
  )
}

WithdrawIcon.defaultProps = defaultProps

export default WithdrawIcon
