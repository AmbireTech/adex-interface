import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const TreeDotsMenu: React.FC<AppIconProps> = ({ size = defaultProps.size, ...rest }) => {
  return (
    <svg
      id="three-dots-menu"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
      viewBox="0 0 20 20"
    >
      <rect id="Rectangle_1619" data-name="Rectangle 1619" width="20" height="20" fill="none" />
      <circle
        id="Ellipse_301"
        data-name="Ellipse 301"
        cx="2"
        cy="2"
        r="2"
        transform="translate(8)"
        fill="#525c75"
      />
      <circle
        id="Ellipse_302"
        data-name="Ellipse 302"
        cx="2"
        cy="2"
        r="2"
        transform="translate(8 8)"
        fill="#525c75"
      />
      <circle
        id="Ellipse_303"
        data-name="Ellipse 303"
        cx="2"
        cy="2"
        r="2"
        transform="translate(8 16)"
        fill="#525c75"
      />
    </svg>
  )
}

export default TreeDotsMenu
