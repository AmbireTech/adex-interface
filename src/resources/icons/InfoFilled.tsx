import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const InfoFilledIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <path
        d="M10 20a10 10 0 1110-10 10.016 10.016 0 01-10 10zm-.75-6a.75.75 0 001.5 0V9a.75.75 0 00-1.5 0zm1.67-8.38a1.032 1.032 0 00-.21-.33 1.155 1.155 0 00-.33-.21.943.943 0 00-.76 0 1.155 1.155 0 00-.33.21 1.032 1.032 0 00-.21.33.942.942 0 000 .76.9.9 0 00.54.54 1 1 0 00.76 0 .9.9 0 00.54-.54.942.942 0 000-.76z"
        fill={color}
        data-name="info filled"
      />
    </svg>
  )
}

InfoFilledIcon.defaultProps = defaultProps

export default InfoFilledIcon
