import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const ActiveIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 8.494 9.03"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <path
        d="M.5 4.505V2.841C.5.768 1.965-.079 3.759.958l1.445.837 1.445.837c1.794 1.036 1.794 2.73 0 3.767l-1.445.837-1.446.836C1.964 9.108.499 8.261.499 6.189z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        data-name="active-icon"
      />
    </svg>
  )
}

ActiveIcon.defaultProps = defaultProps

export default ActiveIcon
