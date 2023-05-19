import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

// TODO: use default props for all the icons - find if there is better syntax
const DepositIcon: React.FC<AppIconProps> = ({ color = defaultProps.color }) => {
  return (
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" data-name="Deposit icon">
      <path d="M0 0h60v60H0z" fill="none" />
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="2.8" data-name="Group 328">
        <path
          d="M27.515 37.974v3.739c0 3.168-2.947 5.728-6.575 5.728s-6.595-2.561-6.595-5.729v-3.738c0 3.168 2.947 5.415 6.593 5.415 3.63-.001 6.577-2.266 6.577-5.415z"
          data-name="Path 2111"
        />
        <path
          d="M27.512 32.908a4.831 4.831 0 01-.7 2.5 6.768 6.768 0 01-5.894 2.91 6.811 6.811 0 01-5.893-2.902 4.831 4.831 0 01-.7-2.5 5.35 5.35 0 011.915-4.034 7.029 7.029 0 014.66-1.676 7.125 7.125 0 014.66 1.676 5.236 5.236 0 011.952 4.026z"
          data-name="Path 2112"
        />
        <path
          d="M27.515 32.908v5.065c0 3.168-2.947 5.415-6.575 5.415s-6.595-2.266-6.595-5.415v-5.065c0-3.168 2.947-5.728 6.593-5.728a7.125 7.125 0 014.66 1.676 5.388 5.388 0 011.917 4.052z"
          data-name="Path 2113"
        />
        <path
          d="M48.232 27.124v3.794a1.891 1.891 0 01-1.842 1.879h-3.61a3.927 3.927 0 01-3.978-3.444 3.795 3.795 0 013.757-4.107h3.831a1.891 1.891 0 011.842 1.878z"
          data-name="Path 2114"
        />
        <path
          d="M11.397 26.259v-3.683c0-5.01 3.02-8.509 7.717-9.1a9.8 9.8 0 011.492-.111h16.575a8.422 8.422 0 011.381.092c4.752.553 7.827 4.07 7.827 9.117v2.671h-3.83a3.795 3.795 0 00-3.762 4.109 3.927 3.927 0 003.983 3.441h3.61v2.671c0 5.525-3.683 9.209-9.209 9.209h-4.6"
          data-name="Path 2115"
        />
      </g>
    </svg>
  )
}

export default DepositIcon
