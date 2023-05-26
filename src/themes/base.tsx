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
  black: '#3C4149',
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
  primaryShade: { light: 3, dark: 4 },
  /**
   * Custom properties
   * Add here some useful non default theme stuff
   */
  other: {
    /**
     * Shades: used to match our custom theme
     */
    shades: {
      /**
       * lighten: e.g. theme.fn.lighten(theme.fn.primaryColor(), theme.other.shades.lighten.lighter)
       */
      lighten: {
        lighter: 0.5,
        lightest: 0.92
      },
      /**
       * hexColorSuffix: e.g. theme.fn.primaryColor() + theme.other.shades.hexColorSuffix.lighter
       */
      hexColorSuffix: {
        lighter: '80',
        lightest: '14'
      }
    },
    /**
     * fontWeights: for consistency outside the default components
     */
    fontWeights: {
      bold: 700,
      medium: 500,
      regular: 400
    }
  }
}
