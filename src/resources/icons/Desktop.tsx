import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DesktopIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 36.8 36.783"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path
          d="M10.355 1.4h16.091a22.765 22.765 0 012.974.152c4.707.524 5.981 2.724 5.981 8.746V20.99c0 6.023-1.274 8.222-5.981 8.746a22.6 22.6 0 01-2.974.152H10.355a22.766 22.766 0 01-2.974-.152C2.674 29.212 1.4 27.012 1.4 20.99V10.3c0-6.023 1.274-8.222 5.981-8.746a22.765 22.765 0 012.974-.154z"
          data-name="Path 2820"
        />
        <path d="M20.99 12.139h6.4" data-name="Path 2821" />
        <path d="M9.658 21.977h17.518" data-name="Path 2822" />
        <path d="M9.715 35.383h17.386" data-name="Path 2823" />
        <path d="M10.243 12.105h.016" data-name="Path 2824" />
        <path d="M15.849 12.105h.016" data-name="Path 2825" />
      </g>
    </svg>
  )
}

DesktopIcon.defaultProps = defaultProps

export default DesktopIcon
