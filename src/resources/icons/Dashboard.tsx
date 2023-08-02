import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DashboardIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g data-name="Dashboard icon">
        <path d="M0 0h26v26H0z" fill="none" />
        <g data-name="Style=Linear">
          <g
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            data-name="vuesax/linear/element-3"
          >
            <path d="M23 9.52V4.98C23 3.57 22.36 3 20.77 3h-4.04c-1.59 0-2.23.57-2.23 1.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97zM23 20.77v-4.04c0-1.59-.64-2.23-2.23-2.23h-4.04c-1.59 0-2.23.64-2.23 2.23v4.04c0 1.59.64 2.23 2.23 2.23h4.04c1.59 0 2.23-.64 2.23-2.23zM11.5 9.52V4.98C11.5 3.57 10.86 3 9.27 3H5.23C3.64 3 3 3.57 3 4.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97zM11.5 20.77v-4.04c0-1.59-.64-2.23-2.23-2.23H5.23c-1.59 0-2.23.64-2.23 2.23v4.04C3 22.36 3.64 23 5.23 23h4.04c1.59 0 2.23-.64 2.23-2.23z" />
          </g>
        </g>
      </g>
    </svg>
  )
}

DashboardIcon.defaultProps = defaultProps

export default DashboardIcon
