import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const LogoutIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.5 20.54"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path
          d="M8.149 5.82c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99"
          data-name="Path 2942"
        />
        <path d="M.749 10.26h12.88" data-name="Path 2943" />
        <path d="M11.4 6.91l3.349 3.35-3.35 3.35" data-name="Path 2944" />
      </g>
    </svg>
  )
}

LogoutIcon.defaultProps = defaultProps

export default LogoutIcon
