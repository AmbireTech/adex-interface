import {
  MantineThemeOverride,
  DEFAULT_THEME,
  Tuple,
  DefaultMantineColor,
  ButtonStylesParams
} from '@mantine/core'

type ExtendedCustomColors = 'brand' | 'secondary' | DefaultMantineColor

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }
}

// NOTE: Put here components overrides for sizes, form, animations etc. In light/(dark) theme - only colors
export const baseTheme: MantineThemeOverride = {
  ...DEFAULT_THEME,
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
      },
      /**
       * lighten: e.g. theme.fn.rgba(theme.fn.primaryColor(), theme.other.shades.rgba.lighter)
       */
      rgba: {
        lighter: 0.5,
        lightest: 0.08
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
  },
  focusRing: 'never',
  defaultRadius: 'md',
  white: '#fefefe',
  black: '#3C4149',
  fontFamily: 'Roboto, sans-serif',
  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: '4.1662rem', fontWeight: '600', lineHeight: '5,2081rem' },
      h2: { fontSize: '2.5rem', fontWeight: '400', lineHeight: '3,25rem' },
      h3: { fontSize: '1.6669rem', fontWeight: '600', lineHeight: '2.25rem' },
      h4: { fontSize: '1.6669rem', fontWeight: '400', lineHeight: '2.25rem' },
      h5: { fontSize: '1.1669rem', fontWeight: '500', lineHeight: '1.6919rem' }
      // ...
    }
  },
  transitionTimingFunction: '0.2s ease-out',
  components: {
    Button: {
      styles: (theme, params: ButtonStylesParams, { variant }) => ({
        root: {
          borderRadius: '100px',
          borderWidth: 2,
          // TODO: outline button needs fixing the background to be rounded form the start
          background:
            variant === 'outline'
              ? theme.fn.rgba(
                  theme.colors[params.color || theme.primaryColor][theme.fn.primaryShade()],
                  theme.other.shades.rgba.lightest
                )
              : '',
          backgroundImage:
            variant === 'outline'
              ? theme.fn.radialGradient(
                  theme.colors[params.color || theme.primaryColor][theme.fn.primaryShade()],
                  theme.colors[params.color || theme.primaryColor][theme.fn.primaryShade()]
                )
              : '',
          backgroundSize: variant === 'outline' ? '0% 100%' : '',
          backgroundPosition: variant === 'outline' ? '50% 50%' : '',
          backgroundRepeat: 'no-repeat',
          transition:
            variant === 'outline'
              ? `background-size ${theme.transitionTimingFunction}, color ${theme.transitionTimingFunction}`
              : '',
          // TODO: active etc.
          '&:hover': {
            color:
              variant === 'outline'
                ? theme.fn.variant({
                    color: params.color,
                    variant: 'filled',
                    gradient: params.gradient
                  }).color
                : '',
            backgroundSize: '100% 100%'
          }
        }
      })
    }
  },
  primaryShade: { light: 3, dark: 4 }
}
