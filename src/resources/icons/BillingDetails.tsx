import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const BillingDetailsIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 23.459 25.85"
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
        data-name="Billing details icon"
      >
        <path
          d="M22.067 12.411V7.07c0-5.053-1.179-6.32-5.918-6.32h-9.48C1.929.75.751 2.016.751 7.07v14.119c0 3.335 1.831 4.125 4.05 1.743l.013-.013a2.205 2.205 0 013.486.188l1.265 1.692"
          data-name="Path 2725"
        />
        <path d="M6.392 7.02h10.031" data-name="Path 2726" />
        <path d="M7.646 12.035h7.523" data-name="Path 2727" />
        <path
          d="M19.196 16.763l-4.437 4.438a1.545 1.545 0 00-.376.74l-.238 1.693a.8.8 0 00.953.953l1.693-.238a1.491 1.491 0 00.74-.376l4.439-4.439a1.712 1.712 0 000-2.784 1.706 1.706 0 00-2.774.013z"
          data-name="Path 2728"
        />
        <path d="M18.555 17.402a3.994 3.994 0 002.784 2.784" data-name="Path 2729" />
      </g>
    </svg>
  )
}

BillingDetailsIcon.defaultProps = defaultProps

export default BillingDetailsIcon
