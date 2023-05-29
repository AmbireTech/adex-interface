import React from 'react'

const AdExLogo: React.FC<{ primary?: string; secondary?: string; text?: string }> = ({
  primary = '#073075',
  secondary = '#51A8FF',
  text = '#0F50BF'
}) => {
  return (
    <svg
      height="100%"
      fillRule="evenodd"
      viewBox="0 0 21000 14800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8952.96 8632.15h600.72l218.15-567.93h916.2l214.79 567.93h624.22l-949.76-2352.38h-661.14l-963.18 2352.38zm993.38-1028.33l288.63-752.76 281.9 752.76h-570.53zM12938.58 8632.15h536.97v-2470l-543.68 117.62v668.74c-134.24-77.29-288.63-117.61-453.07-117.61-516.83 0-922.92 399.9-922.92 910.7 0 510.81 399.38 914.07 906.14 914.07 174.51 0 338.96-53.76 476.56-154.58v131.06zm-849.08-890.55c0-255.4 201.36-450.31 466.49-450.31 147.66 0 281.9 50.41 375.88 137.78v621.7c-97.33 94.1-224.86 141.15-375.88 141.15-261.77 0-466.49-194.91-466.49-450.32zM13903.76 8632.15h1865.96v-500.72H14481v-443.59h842.36v-483.92H14481v-423.43h1275.3v-500.72h-1852.54zM15929.46 8632.15h607.44l369.17-507.44 372.52 507.44h630.93l-691.34-907.35 654.43-870.38h-607.44l-345.68 477.2-349.03-477.2h-630.93l664.49 877.1z"
        fill={primary}
        fillRule="nonzero"
      />
      <path
        d="M3076.23 8927.45l1519.16-1519.16-1519.1-1519.1 901.75-901.74 1520.22 1520.29 1520.36-1520.29 901.73 901.74L6401.2 7408.36l1519.11 1519.09-902.88 902.88-1519.09-1519.1-1519.16 1519.15z"
        fill={secondary}
      />
      <path
        d="M4080.26 4885.22l1418.08-1418.05 1418.04 1418.05-760.78 760.81-657.26-657.27-657.28 657.27zM4080.26 9931.43l1418.08 1418.06 1418.04-1418.06-760.78-760.8-657.26 657.26-657.28-657.26z"
        fill={text}
      />
    </svg>
  )
}

export default AdExLogo
