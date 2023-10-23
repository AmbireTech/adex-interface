import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const CompletedIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      data-name="completed icon"
      width={size}
      height={size}
      {...rest}
    >
      <path
        d="M13.999 7a7 7 0 01-1.011 3.609 6.73 6.73 0 01-1.384 1.649 6.929 6.929 0 01-9.007.156h-.014a6.741 6.741 0 01-1.571-1.8A7 7 0 01-.001 7a7.014 7.014 0 017-7 7.007 7.007 0 017 7z"
        fill="none"
        data-name="Path 3153"
      />
      <path
        d="M2.682 7l2.736 2.735 5.913-5.471"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        data-name="Path 3154"
      />
    </svg>
  )
}

CompletedIcon.defaultProps = defaultProps

export default CompletedIcon
