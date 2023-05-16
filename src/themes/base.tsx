import { MantineThemeOverride, DEFAULT_THEME } from '@mantine/core'

export const baseTheme: MantineThemeOverride = {
  ...DEFAULT_THEME,
  focusRing: 'never',
  defaultRadius: 'md',
  white: '#fefefe',
  black: '#010101',
  fontFamily: 'Roboto, sans-serif',
  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      //   h1: { fontSize: '3rem', fontWeight: '600', lineHeight: '3.6rem' }
      // ...
    }
  },
  components: {
    Button: {
      styles: {
        root: {
          borderRadius: '100px'
        }
      }
    }
  }
}
