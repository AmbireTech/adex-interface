import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const TimeIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 24.057 25.861"
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
        data-name="Statements icon"
      >
        <path
          d="M21.193 11.933V6.811c0-4.846-1.13-6.061-5.676-6.061H6.426C1.881.75.75 1.965.75 6.811v13.54c0 3.2 1.756 3.956 3.884 1.671l.012-.012a2.115 2.115 0 013.343.18l1.215 1.623"
          data-name="Path 2684"
        />
        <path
          d="M18.427 24.079a3.848 3.848 0 10-3.848-3.848 3.848 3.848 0 003.848 3.848z"
          data-name="Path 2685"
        />
        <path d="M22.994 24.8l-1.2-1.2" data-name="Path 2686" />
        <path d="M6.161 6.763h9.62" data-name="Path 2687" />
        <path d="M7.364 11.573h7.215" data-name="Path 2688" />
      </g>
    </svg>
  )
}

TimeIcon.defaultProps = defaultProps

export default TimeIcon
