import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const VisibilityIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.835 18.414"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
        data-name="visibillity icon"
      >
        <path
          d="M14.576 9.212a3.659 3.659 0 11-3.659-3.659 3.655 3.655 0 013.659 3.659z"
          data-name="Path 2312"
        />
        <path
          d="M10.918 17.664c3.608 0 6.97-2.126 9.31-5.8a5.443 5.443 0 000-5.3c-2.34-3.679-5.7-5.8-9.31-5.8s-6.97 2.126-9.31 5.8a5.443 5.443 0 000 5.3c2.34 3.674 5.702 5.8 9.31 5.8z"
          data-name="Path 2313"
        />
      </g>
    </svg>
  )
}

VisibilityIcon.defaultProps = defaultProps

export default VisibilityIcon
