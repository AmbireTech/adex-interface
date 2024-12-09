import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const PolygonIcon: React.FC<AppIconProps> = ({ size = defaultProps.size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      data-name="Polygon icon"
      width={size}
      height={size}
      {...rest}
    >
      <rect height="32" width="32" fill="transparent" rx="12" transform="rotate(-90 16 16)" />
      <path
        d="M24.679 15.076l-3.833-2.228a1.3 1.3 0 00-1.3 0q-3.633 2.111-7.267 4.217a.941.941 0 01-.946 0l-2.3-1.338a.941.941 0 01-.468-.814v-2.686a.941.941 0 01.468-.814l2.3-1.338a.941.941 0 01.946 0l2.3 1.338a.941.941 0 01.468.814v1.743l1.886-1.091v-1.545a1.3 1.3 0 00-.644-1.119l-3.832-2.228a1.3 1.3 0 00-1.3 0l-3.834 2.228a1.3 1.3 0 00-.645 1.119v4.472a1.294 1.294 0 00.645 1.119l3.833 2.228a1.3 1.3 0 001.3 0q3.634-2.107 7.266-4.216a.941.941 0 01.946 0l2.3 1.338a.941.941 0 01.468.814v2.687a.941.941 0 01-.468.814l-2.3 1.338a.941.941 0 01-.946 0l-2.3-1.338a.941.941 0 01-.468-.814v-1.745l-1.886 1.091v1.545a1.3 1.3 0 00.644 1.119l3.833 2.228a1.3 1.3 0 001.3 0l3.833-2.228a1.3 1.3 0 00.644-1.119v-4.471a1.3 1.3 0 00-.644-1.119z"
        fill="#904dff"
        data-name="Path 57"
      />
    </svg>
  )
}

export default PolygonIcon
