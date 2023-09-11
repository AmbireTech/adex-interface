import { MantineThemeOverride } from '@mantine/core'
import { baseTheme } from './base'

export const darkTheme: MantineThemeOverride = {
  ...baseTheme,
  colorScheme: 'dark',
  //   TODO: Change all the colors/shades with the dark ones
  colors: {
    brand: [
      '#ECEFF7',
      '#ABBAE1',
      '#6C89D8',
      '#2C5CDE', // Primary
      '#1E48BE', // Secondary
      '#2B4077',
      '#283457',
      '#232A40',
      '#1D2230',
      '#181B24'
    ],
    secondary: [
      '#C1CAE3',
      '#8196D1',
      '#4368CD',
      '#1E48BE', // Secondary
      '#233C84',
      '#22315D',
      '#1E2842',
      '#1A2030',
      '#151923',
      '#111319'
    ],
    mainText: [
      '#252A3A',
      '#1F2537',
      '#192035',
      '#141C33', // MainText
      '#151B2B',
      '#151925',
      '#141720',
      '#13151B',
      '#121418',
      '#111215'
    ],
    secondaryText: [
      '#79808F',
      '#6B7386',
      '#5E677D',
      '#525C75', // SecondaryText
      '#4D5466',
      '#484D5A',
      '#42464F',
      '#3D3F46',
      '#37393E',
      '#323437'
    ],
    darkBackground: [
      '#FAFAFC',
      '#F6F6F9',
      '#F2F2F6',
      '#F5F6FA', // DarkBackground
      '#EDEFF3',
      '#E6E8ED',
      '#E0E2E8',
      '#D8DBE1',
      '#D2D5DB',
      '#CACED2'
    ],
    decorativeBorders: [
      '#FFFFFF',
      '#FFFFFF',
      '#FCFDFE',
      '#DAE0F2', // DecorativeBorders
      '#BAC5E4',
      '#A0ADD5',
      '#8998C6',
      '#7687B8',
      '#6677AA',
      '#5B6B99'
    ],
    mainBackground: [
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FCFCFC', // MainBackground
      '#E3E3E3',
      '#CCCCCC',
      '#B8B8B8',
      '#A5A5A5',
      '#959595',
      '#868686'
    ]
    // NOTE: needs 10 shades to work https://mantine.dev/theming/colors/
    // attention: ['#FFBE4D', '#FFBE4D', '#FFBE4D'],
    // warning: ['#FF6A42', '#FF6A42', '#FF6A421A'],
    // error: ['#FB185C', '#FB185C80', '#FB185C80']
  },
  primaryColor: 'brand',
  defaultGradient: {
    from: 'brand',
    to: 'secondary',
    deg: 90
  }
}
