import { MantineThemeOverride, DEFAULT_THEME } from '@mantine/core'

// NOTE: Put here components overrides for sizes, form, animations etc. In light/(dark) theme - only colors
export const baseTheme: MantineThemeOverride = {
  ...DEFAULT_THEME,
  transitionTimingFunction: 'ease-in-out',
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
          borderRadius: '100px',
          fontWeight: 'normal',
          fontSize: '16px'
        }
      }
    }
  }
}
