import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const DepositIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 38.757 36"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g data-name="Deposit icon">
        <g
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          data-name="Group 328"
        >
          <path
            d="M17.084 25.554v3.731c0 3.161-2.94 5.716-6.561 5.716s-6.581-2.556-6.581-5.717v-3.73c0 3.161 2.94 5.4 6.579 5.4 3.621.003 6.563-2.258 6.563-5.4z"
            data-name="Path 2111"
          />
          <path
            d="M17.081 20.5a4.82 4.82 0 01-.7 2.5 6.754 6.754 0 01-5.881 2.9A6.8 6.8 0 014.619 23a4.821 4.821 0 01-.7-2.5 5.338 5.338 0 011.913-4.025 7.014 7.014 0 014.65-1.672 7.11 7.11 0 014.65 1.672 5.225 5.225 0 011.949 4.025z"
            data-name="Path 2112"
          />
          <path
            d="M17.084 20.499v5.054c0 3.161-2.94 5.4-6.561 5.4s-6.579-2.261-6.579-5.4v-5.054c0-3.161 2.94-5.716 6.579-5.716a7.11 7.11 0 014.65 1.672 5.376 5.376 0 011.911 4.044z"
            data-name="Path 2113"
          />
          <path
            d="M37.759 14.732v3.786a1.887 1.887 0 01-1.838 1.875h-3.6a3.919 3.919 0 01-3.97-3.437 3.787 3.787 0 013.749-4.1h3.819a1.887 1.887 0 011.84 1.876z"
            data-name="Path 2114"
          />
          <path
            d="M1 13.865v-3.676c0-5 3.014-8.491 7.7-9.079A9.78 9.78 0 0110.189 1h16.54a8.4 8.4 0 011.378.092c4.742.551 7.811 4.062 7.811 9.1v2.665H32.1a3.787 3.787 0 00-3.749 4.1 3.919 3.919 0 003.97 3.437h3.6v2.665c0 5.513-3.676 9.189-9.189 9.189h-4.597"
            data-name="Path 2115"
          />
        </g>
      </g>
    </svg>
  )
}

export default DepositIcon
