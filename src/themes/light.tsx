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
    // NOTE: Dark variation color is using for secondary text
    darkVariation: [
      '#747B91',
      '#656E88',
      '#586280', // Dark Variation
      '#535A70',
      '#4D5262',
      '#474B56',
      '#41444C',
      '#3C3E44',
      '#37383C'
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
