import { MantineThemeOverride } from '@mantine/core'
import { baseTheme } from './base'

export const lightTheme: MantineThemeOverride = {
  ...baseTheme,
  colorScheme: 'light',
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
    secondaryText: [
      '#858A9A',
      '#747B91',
      '#656E88',
      '#586280', // SecondaryText
      '#535A70',
      '#4D5262',
      '#474B56',
      '#41444C',
      '#3C3E44',
      '#37383C'
    ],
    lightBackground: [
      '#FAFAFC',
      '#F6F6F9',
      '#F2F2F6',
      '#F5F6FA', // LightBackground
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
