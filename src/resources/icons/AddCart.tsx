import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const AddCartIcon: React.FC<AppIconProps> = ({
  color = defaultProps.color,
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  ...rest
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <defs>
        <clipPath id="a">
          <path
            d="M0 0h24v24H0z"
            fill="#fff"
            transform="translate(19.682 19.682)"
            data-name="Add Cart icon"
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#a)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transform="translate(-19.682 -19.682)"
        data-name="add card icon"
      >
        <path
          d="M27.757 35.607h-2.522q-3.366 0-3.366-3.365v-7.007q0-3.366 3.366-3.366h4.485q3.371 0 3.366 3.366"
          data-name="Path 2750"
        />
        <path
          d="M38.129 41.495h-4.484q-3.371 0-3.366-3.366v-7.006q0-3.366 3.366-3.366h4.484q3.371 0 3.366 3.366v7.007q0 3.37-3.366 3.365z"
          data-name="Path 2751"
        />
        <path d="M34.499 34.626h3.2" data-name="Path 2752" />
        <path d="M36.098 36.226v-3.2" data-name="Path 2753" />
      </g>
    </svg>
  )
}

export default AddCartIcon
