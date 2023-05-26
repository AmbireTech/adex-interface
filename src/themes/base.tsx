import { MantineThemeOverride, DEFAULT_THEME, Tuple, DefaultMantineColor } from '@mantine/core'

type ExtendedCustomColors = 'brand' | 'secondary' | DefaultMantineColor

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }
}

// NOTE: Put here components overrides for sizes, form, animations etc. In light/(dark) theme - only colors
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
  },
  primaryShade: { light: 3, dark: 4 }
}
