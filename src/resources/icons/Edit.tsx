import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const EditIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.751 21.76"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5" data-name="edit icon">
        <path d="M9.75 1.01h-2c-5 0-7 2-7 7v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" data-name="Path 2225" />
        <path
          d="M14.79 2.03L6.91 9.91a2.712 2.712 0 00-.66 1.32l-.43 3.01a1.424 1.424 0 001.7 1.7l3.01-.43a2.8 2.8 0 001.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94s-3.58-1.36-4.94 0z"
          data-name="Path 2226"
        />
        <path d="M13.66 3.16A7.144 7.144 0 0018.6 8.1" data-name="Path 2227" />
      </g>
    </svg>
  )
}

EditIcon.defaultProps = defaultProps

export default EditIcon
