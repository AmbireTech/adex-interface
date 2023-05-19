import { MantineThemeOverride } from '@mantine/core'
import { baseTheme } from './base'

export const lightTheme: MantineThemeOverride = {
  ...baseTheme,
  colorScheme: 'light',
  colors: {
    brand: [
      '#D6C4FF',
      '#AC88FF',
      '#8854FF',
      '#6A2AFF',
      '#4A00FF',
      '#3F00DA',
      '#3600B9',
      '#2E009D',
      '#270086',
      '#210072'
    ],
    secondary: [
      '#A3FFFC',
      '#3DFFF9',
      '#00FFF1',
      '#00C0B2',
      '#008C82',
      '#00625B',
      '#004540',
      '#00302D',
      '#00221F',
      '#001816'
    ]
    // NOTE: needs 10 shades to work https://mantine.dev/theming/colors/
    // attention: ['#FFBE4D', '#FFBE4D', '#FFBE4D'],
    // warning: ['#FF6A42', '#FF6A42', '#FF6A421A'],
    // error: ['#FB185C', '#FB185C80', '#FB185C80']
  },
  primaryColor: 'brand',
  primaryShade: 3,
  defaultGradient: {
    from: 'brand',
    to: 'secondary',
    deg: 90
  }
}
