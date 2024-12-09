import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const CampaignIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <g data-name="Campaign icon">
        <path
          d="M24.26 22.132A10.47 10.47 0 0114.077 35v-8.369m10.183-4.5A26.119 26.119 0 0035 1a26.118 26.118 0 00-21.13 10.74m10.39 10.392a26.024 26.024 0 01-10.183 4.5M13.87 11.74A10.471 10.471 0 001 21.923h8.37m4.5-10.183a26.027 26.027 0 00-4.5 10.183m4.706 4.708q-.27.055-.543.1a26.312 26.312 0 01-4.268-4.268q.049-.273.1-.545m-3.9 4.169a7.86 7.86 0 00-3.066 7.507 7.859 7.859 0 007.507-3.066M25.85 12.769a2.615 2.615 0 11-2.619-2.619 2.615 2.615 0 012.619 2.619z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          data-name="Group 262"
        />
      </g>
    </svg>
  )
}

export default CampaignIcon
