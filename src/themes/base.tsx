import {
  MantineThemeOverride,
  DEFAULT_THEME,
  Tuple,
  DefaultMantineColor,
  ButtonStylesParams,
  rem,
  AlertStylesParams
} from '@mantine/core'
import DownArrowIcon from 'resources/icons/DownArrow'

type ExtendedCustomColors =
  | 'brand'
  | 'brandDarker'
  | 'secondary'
  | 'mainText'
  | 'secondaryText'
  | 'lightBackground'
  | 'decorativeBorders'
  | 'mainBackground'
  | 'success'
  | 'info'
  | 'draft'
  | 'alternativeBackground'
  | 'attention'
  | 'secondaryAccent'
  | 'darkBackground'
  | 'chartColorOne'
  | 'chartColorTwo'
  | 'chartColorThree'
  | 'chartColorFour'
  | 'warning'
  | 'nonDecorativeBorders'
  | DefaultMantineColor

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }
}

const SIDE_BAR_WIDTH = 227

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
    },
    /**
     * Add print-specific styles. Usage: [theme.other.media.print]
     */
    media: {
      print: '@media print',
      mobile: '@media(max-width:475px)'
    }
  },
  focusRing: 'never',
  defaultRadius: 'md',
  white: '#fefefe',
  black: '#141C33',
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
  transitionTimingFunction: 'ease-out',
  components: {
    Alert: {
      styles: (theme, { color }: AlertStylesParams, { variant }) => {
        const custom = variant === 'outline'
        return {
          root: {
            background: custom
              ? theme.fn.lighten(
                  theme.colors[color][theme.fn.primaryShade()],
                  theme.other.shades.lighten.lightest
                )
              : '',
            borderColor: custom ? theme.colors[color][theme.fn.primaryShade()] : '',
            svg: {
              color: custom ? theme.colors[color][theme.fn.primaryShade()] : '',
              marginTop: custom ? theme.spacing.md : '',
              width: rem(30),
              height: rem(30)
            }
          },
          message: {
            color: custom ? theme.colors.mainText[theme.fn.primaryShade()] : ''
          }
        }
      }
    },
    Select: {
      defaultProps: {
        size: 'md',
        rightSectionWidth: 30,
        rightSection: <DownArrowIcon size={rem(10)} />
      },
      styles: () => ({
        rightSection: { pointerEvents: 'none' }
      })
    },
    Button: {
      defaultProps: {
        radius: 'xl'
      },
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
            borderWidth: variant === 'filled' ? 0 : 2,
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
    },
    Modal: {
      styles: (theme) => ({
        root: {
          [theme.other.media.print]: {
            overflow: 'visible'
          }
        },
        inner: {
          [theme.other.media.print]: {
            overflow: 'visible',
            // Fixes double print, no idea why with fixed it prints twice
            position: 'absolute',
            // Fix if used with "centered" modal prop
            alignItems: 'flex-start'
          }
        },
        content: {
          [theme.other.media.print]: {
            overflow: 'visible'
          }
        }
      })
    },
    Navbar: {
      defaultProps: {
        width: { sm: SIDE_BAR_WIDTH }
      }
    },
    Input: {
      styles: (theme) => ({
        input: {
          backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
          borderColor: theme.colors.nonDecorativeBorders[theme.fn.primaryShade()],
          borderRadius: theme.radius.md
        },
        icon: {
          borderRight: '1px solid',
          borderColor: theme.colors.nonDecorativeBorders[theme.fn.primaryShade()]
        }
      })
    },
    Dropzone: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()]
        }
      })
    }
  },
  primaryShade: { light: 3, dark: 4 }
}
