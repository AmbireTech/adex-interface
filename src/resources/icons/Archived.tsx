import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const ArchivedIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...rest}>
      <g fill="none" stroke={color} strokeLinecap="round" data-name="archived icon">
        <path
          d="M7.5 3.788V7.3c0 .8-.2 1.2-1.2 1.2H2.7c-1 0-1.2-.4-1.2-1.2V3.788"
          data-name="Path 3298"
        />
        <path
          d="M1.7.5h5.6a1.061 1.061 0 011.2 1.2v.8a1.061 1.061 0 01-1.2 1.2H1.7A1.061 1.061 0 01.5 2.5v-.8A1.061 1.061 0 011.7.5z"
          data-name="Path 3299"
        />
        <path d="M3.772 5.3h1.456" data-name="Path 3300" />
      </g>
    </svg>
  )
}

ArchivedIcon.defaultProps = defaultProps

export default ArchivedIcon
