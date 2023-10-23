import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DraftIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      data-name="draft icon"
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
        d="M8.011 3.076l-4.67 4.67a1.626 1.626 0 00-.4.778l-.247 1.781a.837.837 0 001 1l1.783-.252a1.569 1.569 0 00.778-.4l4.67-4.67a1.8 1.8 0 000-2.929 1.8 1.8 0 00-2.914.022z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        data-name="Path 3155"
      />
      <path
        d="M7.881 3.915a3.185 3.185 0 002.22 2.22"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        data-name="Path 3156"
      />
    </svg>
  )
}

DraftIcon.defaultProps = defaultProps

export default DraftIcon
