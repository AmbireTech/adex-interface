import React from 'react'

// NOTE: for text use wrapper with c='desired color'
// e.g.     <Box c="brandDarker">

const AdExLogo: React.FC<{ primary?: string; secondary?: string }> = ({
  primary = '#2C5CDE',
  secondary = '#7298fe'
}) => {
  return (
    <svg
      viewBox="0 0 103.418 39.999"
      xmlns="http://www.w3.org/2000/svg"
      data-name="AdEx Network logo"
    >
      <g data-name="Group 1109">
        {/* TEXT */}
        <g fill="currentColor" data-name="Group 1104">
          <path
            d="M31.582 29.81H36.4l1.748-4.555h7.349l1.724 4.555h5.007L44.61 10.943h-5.3zm7.967-8.248l2.314-6.038 2.262 6.038z"
            data-name="Path 3065"
          />
          <path
            d="M63.549 29.811h4.307V10l-4.36.944v5.363A7.345 7.345 0 1059.727 30a6.417 6.417 0 003.822-1.24zm-6.81-7.143a3.607 3.607 0 013.741-3.611 4.406 4.406 0 013.015 1.105v4.986a4.185 4.185 0 01-3.015 1.132 3.624 3.624 0 01-3.74-3.612z"
            data-name="1"
          />
          <path
            d="M71.29 29.81h14.964v-4.016H75.919v-3.558h6.756v-3.882h-6.756v-3.4h10.229v-4.016H71.29z"
            data-name="2"
          />
          <path
            d="M87.539 29.811h4.872l2.962-4.07 2.986 4.07h5.061l-5.544-7.278 5.248-6.98h-4.872l-2.771 3.827-2.8-3.827H87.62l5.33 7.035z"
            data-name="3"
          />
        </g>
      </g>
      {/* X */}
      <g fillRule="evenodd" data-name="Group 1111">
        <path
          d="M0 27.709L7.709 20 0 12.292l4.576-4.576 7.715 7.715 7.715-7.715 4.576 4.576L16.873 20l7.709 7.709L20 32.291l-7.709-7.709-7.709 7.709z"
          fill={secondary}
          data-name="Path 3069"
        />
        {/* ^ */}
        <g fill={primary} data-name="Group 1110">
          <path
            d="M5.094 7.195l7.2-7.2 7.2 7.2-3.861 3.861-3.335-3.335-3.335 3.335z"
            data-name="Path 3067"
          />
          <path
            d="M5.094 32.802l7.2 7.2 7.2-7.2-3.861-3.86-3.335 3.335-3.335-3.335z"
            data-name="Path 3068"
          />
        </g>
      </g>
    </svg>
  )
}

export default AdExLogo
