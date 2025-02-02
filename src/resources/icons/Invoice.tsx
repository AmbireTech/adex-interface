import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const InvoiceIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 21.943 25.55"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        data-name="invoice icon"
      >
        <path
          d="M21.193 6.81v11.929a9.86 9.86 0 01-.6 4.052.091.091 0 01-.024.048 1.253 1.253 0 01-1.022.505 3.369 3.369 0 01-2.237-1.311 2.126 2.126 0 00-3.367.18l-1.215 1.611a2.069 2.069 0 01-3.511 0L7.99 22.201a2.115 2.115 0 00-3.343-.18l-.012.012c-1.359 1.455-2.561 1.671-3.259.806a.091.091 0 01-.026-.05 9.86 9.86 0 01-.6-4.05V6.81a9.86 9.86 0 01.6-4.052c0-.012 0-.024.024-.036.685-.878 1.9-.661 3.259.794l.012.012a2.115 2.115 0 003.343-.18l1.227-1.623a2.069 2.069 0 013.511 0l1.215 1.611a2.126 2.126 0 003.367.18 3.369 3.369 0 012.242-1.311 1.265 1.265 0 011.022.517c.024.012.024.024.024.036a9.86 9.86 0 01.597 4.052z"
          data-name="Path 2708"
        />
        <path d="M6.763 10.67h9.62" data-name="Path 2709" />
        <path d="M6.763 14.88h7.215" data-name="Path 2710" />
      </g>
    </svg>
  )
}

export default InvoiceIcon
