import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const EthereumIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      data-name="Ethereum icon"
      width={size}
      height={size}
      {...rest}
    >
      <rect height="32" width="32" fill="transparent" rx="12" transform="rotate(-90 16 16)" />
      <g fillRule="evenodd">
        <path d="M16 6l-6 9.9 6 3.536 5.955-3.526z" fill="#62688f" data-name="Path 50" />
        <path d="M15.997 6v13.432l5.957-3.522z" fill="#454a75" data-name="Path 51" />
        <path d="M16 6l-6 9.9 6-2.72 5.955 2.73z" fill="#8a92b2" data-name="Path 52" />
        <path d="M15.997 6v7.177l5.957 2.733z" fill="#62688f" data-name="Path 53" />
        <path
          d="M10.027 17.03l5.97 8.4 5.974-8.4-5.974 3.526z"
          fill="#8a92b2"
          data-name="Path 54"
        />
        <path d="M15.997 25.432l5.974-8.4-5.974 3.526z" fill="#62688f" data-name="Path 55" />
      </g>
    </svg>
  )
}

EthereumIcon.defaultProps = defaultProps

export default EthereumIcon
