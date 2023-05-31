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
      //   h1: { fontSize: '3rem', fontWeight: '600', lineHeight: '3.6rem' }
      // ...
    }
  },
  transitionTimingFunction: '0.3s ease-out',
  components: {
    Button: {
      styles: (theme, params: ButtonStylesParams, { variant }) => {
        const outlineHoverBgColor = theme.fn.rgba(
          theme.colors[params.color || theme.primaryColor][theme.fn.primaryShade()],
          theme.other.shades.rgba.lightest
        )

        const outlineHoverBgGradient = theme.fn.radialGradient(
          outlineHoverBgColor,
          outlineHoverBgColor
        )

        const filledHoverBgColor =
          theme.colors[params.color || theme.primaryColor][theme.fn.primaryShade() + 1]

        const filledHoverBgGradient = theme.fn.radialGradient(
          filledHoverBgColor,
          filledHoverBgColor
        )

        const customHover = variant === 'outline' || variant === 'filled'

        return {
          root: {
            borderRadius: '100px',
            borderWidth: 2,
            // TODO: outline button needs fixing the background to be rounded form the start
            // background:
            //   variant === 'outline'
            //     ? theme.fn.rgba(
            //         theme.colors[params.color || theme.primaryColor][theme.fn.primaryShade()],
            //         theme.other.shades.rgba.lightest
            //       )
            //     : '',
            backgroundImage:
              // eslint-disable-next-line no-nested-ternary
              variant === 'outline'
                ? outlineHoverBgGradient
                : variant === 'filled'
                ? filledHoverBgGradient
                : '',
            backgroundSize: customHover ? '0% 100%' : '',
            backgroundPosition: customHover ? '50% 50%' : '',
            backgroundRepeat: 'no-repeat',
            transition: customHover ? `background-size ${theme.transitionTimingFunction}` : '',
            // TODO: active etc.
            '&:hover': {
              // color:
              //   variant === 'outline'
              //     ? theme.fn.variant({
              //         color: params.color,
              //         variant: 'filled',
              //         gradient: params.gradient
              //       }).color
              //     : '',
              backgroundSize: '100% 100%',
              backgroundColor:
                variant === 'filled'
                  ? theme.colors[params.color || theme.primaryColor][theme.fn.primaryShade()]
                  : ''
            }
          }
        }
      }
    }
  },
  primaryShade: { light: 3, dark: 4 }
}
