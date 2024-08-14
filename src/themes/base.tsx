import {
  MantineThemeOverride,
  DEFAULT_THEME,
  DefaultMantineColor,
  rem,
  Alert,
  Button,
  createTheme,
  mergeMantineTheme,
  MantineTheme,
  ButtonProps,
  AlertProps,
  Modal,
  Input,
  lighten,
  alpha,
  Paper,
  defaultVariantColorsResolver,
  VariantColorsResolver,
  parseThemeColor
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
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
  | 'completed'
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
  | 'stopped'
  | 'paused'
  | 'error'
  | DefaultMantineColor

type Tuple<T, N extends number> = [T, ...T[]] & { length: N }

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }
}

export const SIDE_BAR_WIDTH = 227
const MOBILE_MAX_WIDTH_IN_PX = 475
export const DEFAULT_PRIMARY_SHADE = 3

const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input)
  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme
  })

  // used for action icons mostly
  if (parsedColor.isThemeColor && parsedColor.color === 'mainText') {
    return {
      ...defaultResolvedColors,
      hoverColor: input.theme.colors.brand[DEFAULT_PRIMARY_SHADE]
    }
  }

  return defaultResolvedColors
}

// NOTE: Put here components overrides for sizes, form, animations etc. In light/(dark) theme - only colors
// const themeOverride: MantineThemeOverride = createTheme({
const themeOverride: MantineThemeOverride = createTheme({
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
      mobile: `@media(max-width:${MOBILE_MAX_WIDTH_IN_PX}px)`
    },
    transitionTimingFunction: 'ease-out'
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
  components: {
    Alert: Alert.extend({
      styles: (theme, { color, variant }: AlertProps) => {
        const custom = variant === 'outline'
        return {
          root: {
            background: custom
              ? lighten(
                  theme.colors[color || theme.primaryColor][DEFAULT_PRIMARY_SHADE],
                  theme.other.shades.lighten.lightest
                )
              : '',
            borderColor: custom
              ? theme.colors[color || theme.primaryColor][DEFAULT_PRIMARY_SHADE]
              : '',
            svg: {
              color: custom ? theme.colors[color || theme.primaryColor][DEFAULT_PRIMARY_SHADE] : '',
              marginTop: custom ? theme.spacing.md : '',
              width: rem(30),
              height: rem(30)
            }
          },
          message: {
            color: custom ? theme.colors.mainText[DEFAULT_PRIMARY_SHADE] : ''
          }
        }
      }
    }),
    Select: {
      defaultProps: {
        size: 'md',
        rightSectionWidth: 30,
        rightSection: <DownArrowIcon size="10px" />
      },
      styles: () => ({
        rightSection: { pointerEvents: 'none' }
      })
    },
    Button: Button.extend({
      defaultProps: {
        radius: 'xl'
      },
      styles: (theme: MantineTheme, params: ButtonProps) => {
        const outlineHoverBgColor = alpha(
          theme.colors[params.color || theme.primaryColor][DEFAULT_PRIMARY_SHADE],
          theme.other.shades.rgba.lightest
        )

        const filledHoverBgColor =
          theme.colors[params.color || theme.primaryColor][DEFAULT_PRIMARY_SHADE + 1]

        const customHover = params.variant === 'outline' || params.variant === 'filled'

        return {
          root: {
            background:
              params.variant === 'outline'
                ? alpha(
                    theme.colors[params.color || theme.primaryColor][DEFAULT_PRIMARY_SHADE],
                    theme.other.shades.rgba.lightest
                  )
                : '',
            backgroundImage:
              // eslint-disable-next-line no-nested-ternary
              params.variant === 'outline' && !params.disabled
                ? `radial-gradient(${outlineHoverBgColor}, ${outlineHoverBgColor})`
                : params.variant === 'filled' && !params.disabled
                ? `radial-gradient(${filledHoverBgColor}, ${filledHoverBgColor})`
                : '',
            backgroundSize: customHover ? '0% 100%' : '',
            backgroundPosition: customHover ? '50% 50%' : '',
            backgroundRepeat: 'no-repeat',
            transition: customHover ? 'background-size 0.3s ease-out' : '',
            borderWidth: params.variant === 'filled' ? 0 : 1,
            // TODO: active etc.
            '&:hover': {
              color: params.color,
              backgroundSize: '100% 100%',
              backgroundColor:
                params.variant === 'filled' && !params.disabled
                  ? theme.colors[params.color || theme.primaryColor][DEFAULT_PRIMARY_SHADE]
                  : ''
            }
          }
        }
      }
    }),
    Modal: Modal.extend({
      defaultProps: {
        padding: 0
      },
      styles: (theme) => ({
        root: {
          padding: 0,
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
    }),
    Input: Input.extend({
      styles: (theme) => ({
        input: {
          backgroundColor: theme.colors.lightBackground[DEFAULT_PRIMARY_SHADE],
          // TODO: check how to override it properly
          // borderColor: theme.colors.nonDecorativeBorders[DEFAULT_PRIMARY_SHADE],
          borderRadius: theme.radius.md
        },
        icon: {
          borderRight: '1px solid',
          borderColor: theme.colors.nonDecorativeBorders[DEFAULT_PRIMARY_SHADE]
        }
      })
    }),
    Dropzone: Dropzone.extend({
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.lightBackground[DEFAULT_PRIMARY_SHADE]
        }
      })
    }),
    Paper: Paper.extend({
      defaultProps: {
        shadow: 'none'
      }
    })
  },
  primaryShade: { light: 3, dark: 4 },
  variantColorResolver
})

export const baseTheme = mergeMantineTheme(DEFAULT_THEME, themeOverride)
