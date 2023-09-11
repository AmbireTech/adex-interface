import React from 'react'
import { AppIconProps, defaultProps } from 'types/components/Icon'

const StakingIcon: React.FC<AppIconProps> = ({ color, size, ...rest }) => {
  return (
    <svg
      viewBox="0 0 21.5 22.25"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <path
        d="M15.424 12.136c3.782.23 5.326 1.605 5.326 4.614v.1c0 3.321-1.88 4.652-6.576 4.652H7.325c-4.7 0-6.576-1.33-6.576-4.652v-.1c0-2.987 1.523-4.362 5.242-4.607"
        fill="none"
        stroke="#525c75"
        strokeLinecap="round"
        strokeWidth="1.5"
        data-name="Path 2925"
      />
      <path
        d="M11.349 7.096a.536.536 0 00-.133-.382 1.208 1.208 0 00-.453-.262 5.34 5.34 0 01-.551-.239 1.755 1.755 0 01-.4-.272 1.1 1.1 0 01-.255-.365 1.214 1.214 0 01-.092-.5 1.1 1.1 0 01.317-.8 1.335 1.335 0 01.84-.373v-.627h.469v.636a1.223 1.223 0 01.812.432 1.424 1.424 0 01.293.932h-.847a.808.808 0 00-.145-.528.479.479 0 00-.388-.172.494.494 0 00-.372.136.519.519 0 00-.132.376.5.5 0 00.129.357 1.42 1.42 0 00.479.275 5.32 5.32 0 01.576.265 1.662 1.662 0 01.381.281 1.089 1.089 0 01.237.357 1.229 1.229 0 01.082.467 1.094 1.094 0 01-.311.809 1.362 1.362 0 01-.855.366v.583h-.466v-.58a1.409 1.409 0 01-.93-.426 1.374 1.374 0 01-.33-.966h.847a.779.779 0 00.166.535.6.6 0 00.476.186.582.582 0 00.411-.133.473.473 0 00.145-.368z"
        fill="#525c75"
        data-name="Path 3074"
      />
      <path
        d="M7.251 15.064h7"
        fill="none"
        stroke="#525c75"
        strokeLinecap="round"
        strokeWidth="1.5"
        data-name="Line 213"
      />
      <g
        fill="none"
        stroke="#525c75"
        strokeWidth="1.5"
        transform="rotate(90 6.875 8.375)"
        data-name="Ellipse 257"
      >
        <circle cx="4.5" cy="4.5" r="4.5" stroke="none" />
        <circle cx="4.5" cy="4.5" r="5.25" />
      </g>
    </svg>
  )
}

StakingIcon.defaultProps = defaultProps

export default StakingIcon
