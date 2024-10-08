import {
  // MantineColorShade,
  MantineThemeOverride,
  createTheme,
  mergeMantineTheme
} from '@mantine/core'
import { baseTheme, DEFAULT_PRIMARY_SHADE } from './base'

const theme: MantineThemeOverride = createTheme({
  // colorScheme: 'light',
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
    brandDarker: [
      '#415898',
      '#314B94',
      '#223F92',
      '#123391', // BrandDarker
      '#1C3377',
      '#213263',
      '#243053',
      '#242D47',
      '#242A3C',
      '#222734'
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
    mainText: [
      '#252A3A',
      '#1F2537',
      '#192035',
      '#141C33', // MainText
      '#151B2B',
      '#151925',
      '#141720',
      '#13151B',
      '#121418',
      '#111215'
    ],
    secondaryText: [
      '#79808F',
      '#6B7386',
      '#5E677D',
      '#525C75', // SecondaryText
      '#4D5466',
      '#484D5A',
      '#42464F',
      '#3D3F46',
      '#37393E',
      '#323437'
    ],
    lightBackground: [
      '#FAFAFC',
      '#F6F6F9',
      '#F2F2F6',
      '#F5F6FA', // LightBackground
      '#EDEFF3',
      '#E6E8ED',
      '#E0E2E8',
      '#D8DBE1',
      '#D2D5DB',
      '#CACED2'
    ],
    decorativeBorders: [
      '#FFFFFF',
      '#FFFFFF',
      '#FCFDFE',
      '#DAE0F2', // DecorativeBorders
      '#BAC5E4',
      '#A0ADD5',
      '#8998C6',
      '#7687B8',
      '#6677AA',
      '#5B6B99'
    ],
    mainBackground: [
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FCFCFC', // MainBackground
      '#E3E3E3',
      '#CCCCCC',
      '#B8B8B8',
      '#A5A5A5',
      '#959595',
      '#868686'
    ],
    success: [
      '#45B591',
      '#32B188',
      '#1FB081',
      '#0CB07B', // Success
      '#1A9069',
      '#22775B',
      '#26634F',
      '#285445',
      '#28473D',
      '#273D36'
    ],
    info: [
      '#BAA8E3',
      '#A083E4',
      '#865AED',
      '#6A2AFF',
      '#5F25E7',
      '#5A2BC5',
      '#5635A4',
      '#523A89',
      '#4C3B74',
      '#473A64'
    ],
    draft: [
      '#EBC9C0',
      '#E9AC9B',
      '#EF8C72',
      '#FF6A42',
      '#E95D38',
      '#D25432',
      '#B15239',
      '#94503E',
      '#7E4D40',
      '#6C483F'
    ],
    completed: [
      '#7EB6D5',
      '#5AACDB',
      '#30A5E8',
      '#00A2FF',
      '#178CCF',
      '#2579A9',
      '#2D6A8D',
      '#315D76',
      '#335264',
      '#324956'
    ],
    alternativeBackground: [
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#EBEEFA', // Alternative bg
      '#C9D0EC',
      '#AEB7DB',
      '#99A2C9',
      '#8891B7',
      '#7982A5',
      '#6D7595'
    ],
    attention: [
      '#D6AF7F',
      '#DBA25B',
      '#E89731',
      '#FF8E01', // Attention
      '#CF7D17',
      '#AA6F25',
      '#8D632E',
      '#765832',
      '#644E33',
      '#564632'
    ],
    secondaryAccent: [
      '#E3B4A7',
      '#E49782',
      '#ED7959',
      '#FF5729', // SecondaryAccent
      '#E74E24',
      '#C54C2B',
      '#A34C35',
      '#894A39',
      '#74473B',
      '#63433A'
    ],
    chartColorOne: [
      '#AC9ED2',
      '#957FD0',
      '#7D5DD3',
      '#6437DE', // ChartColorOne
      '#5C35C4',
      '#583DA4',
      '#54408A',
      '#4F4076',
      '#493F65',
      '#433C57'
    ],
    chartColorTwo: [
      '#89BDCA',
      '#6AB6CA',
      '#48B4D0',
      '#21B7DE', // ChartColorTwo
      '#2F9BB7',
      '#368498',
      '#3A7280',
      '#3A636D',
      '#39565E',
      '#374B51'
    ],
    chartColorThree: [
      '#D7C0AA',
      '#D3AE8B',
      '#D59D69',
      '#DE8E43', // ChartColorThree
      '#C8803C',
      '#AA7341',
      '#8F6844',
      '#7A5E44',
      '#695542',
      '#5B4C3F'
    ],
    chartColorFour: [
      '#C9C37C',
      '#CCC25B',
      '#D5C837',
      '#DECD16', // ChartColorFour
      '#B6AA26',
      '#978E2F',
      '#7E7834',
      '#6B6635',
      '#5B5835',
      '#4F4C33'
    ],
    warning: [
      '#C4485E',
      '#C72C48',
      '#C71636',
      '#C90024', // Warning
      '#A3122C',
      '#861D30',
      '#6F2431',
      '#5D2731',
      '#4F282F',
      '#43272C'
    ],
    nonDecorativeBorders: [
      '#DADCE1',
      '#C3C6D0',
      '#ACB2C3',
      '#959EB8',
      '#858EA6',
      '#787F96',
      '#6D7386',
      '#646976',
      '#5C5F69',
      '#54565D'
    ],
    stopped: [
      '#3877AD',
      '#256DAB',
      '#1364AA',
      '#005CAC', // Stopped
      '#0F528B',
      '#194972',
      '#1F415F',
      '#213A50',
      '#223443',
      '#222F3A'
    ],
    paused: [
      '#C1A94D',
      '#C6A730',
      '#C5A11B',
      '#C69E05', // Paused
      '#A18416',
      '#847020',
      '#6E5F26',
      '#5D5229',
      '#4F4729',
      '#433E28'
    ],
    error: [
      '#C4485E',
      '#C72C48',
      '#C71636',
      '#C90024', // Error
      '#A3122C',
      '#861D30',
      '#6F2431',
      '#5D2731',
      '#4F282F',
      '#43272C'
    ]
  },
  primaryColor: 'brand',
  defaultGradient: {
    from: 'brand',
    to: 'secondary',
    deg: 90
  },
  primaryShade: DEFAULT_PRIMARY_SHADE
})

export const lightTheme = mergeMantineTheme(baseTheme, theme)
