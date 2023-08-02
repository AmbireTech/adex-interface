import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const SendCryptoIcon: React.FC<AppIconProps> = ({ color, size, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox="0 0 34.533 34.533"
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
        data-name="Group 1134"
      >
        <path
          d="M13.045 20.284a2.747 2.747 0 002.682 2.81h3.018a2.391 2.391 0 002.329-2.457 2.121 2.121 0 00-1.59-2.329l-4.833-1.685a2.11 2.11 0 01-1.59-2.329 2.4 2.4 0 012.329-2.457h3.019a2.747 2.747 0 012.682 2.81"
          data-name="Path 3075"
        />
        <path d="M17.059 10.247v14.454" data-name="Path 3076" />
        <path d="M33.119 17.473a16.059 16.059 0 11-16.06-16.059" data-name="Path 3077" />
        <path d="M33.119 7.838V1.414h-6.424" data-name="Path 3078" />
        <path d="M25.089 9.444l8.03-8.03" data-name="Path 3079" />
      </g>
    </svg>
  )
}

SendCryptoIcon.defaultProps = defaultProps

export default SendCryptoIcon
