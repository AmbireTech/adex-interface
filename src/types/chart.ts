import { AnimationTrajectory } from '@visx/react-spring/lib/types'
import { ITimeFrameData } from 'types'
import { curveLinear, curveStep, curveCardinal } from '@visx/curve'
import { GlyphProps, XYChartTheme } from '@visx/xychart'
import { RenderTooltipGlyphProps } from '@visx/xychart/lib/components/Tooltip'
import getAnimatedOrUnanimatedComponents from 'components/common/Chart/getAnimatedOrUnanimatedComponents'

type Accessor = (d: ITimeFrameData) => number | string

interface Accessors {
  Impressions: Accessor
  'Clicks and CRT': Accessor
  'Average CPM': Accessor
  'Total spent': Accessor
}

export type DataKey = keyof Accessors

type SimpleScaleConfig = { type: 'band' | 'linear'; paddingInner?: number }

export type ProvidedProps = {
  accessors: {
    x: Accessors
    y: Accessors
    date: Accessor
  }
  animationTrajectory?: AnimationTrajectory
  annotationDataKey?: DataKey | null
  annotationDatum?: ITimeFrameData
  annotationLabelPosition?: { dx: number; dy: number }
  annotationType?: 'line' | 'circle'
  colorAccessorFactory: (key: DataKey) => (d: ITimeFrameData) => string | null
  config: {
    x: SimpleScaleConfig
    y: SimpleScaleConfig
  }
  curve: typeof curveLinear | typeof curveCardinal | typeof curveStep
  data: ITimeFrameData[]
  editAnnotationLabelPosition: boolean
  numTicks: number
  setAnnotationDataIndex?: (index: number) => void
  setAnnotationDataKey: (key: DataKey | null) => void
  setAnnotationLabelPosition?: (position: { dx: number; dy: number }) => void
  renderAreaSeries: boolean
  renderAreaStack: boolean
  renderBarGroup: boolean
  renderBarSeries: boolean
  renderBarStack: boolean
  renderGlyph: React.FC<GlyphProps<ITimeFrameData>>
  enableTooltipGlyph: boolean
  renderTooltipGlyph: React.FC<RenderTooltipGlyphProps<ITimeFrameData>>
  renderHorizontally: boolean
  renderLineSeries: boolean
  sharedTooltip: boolean
  showGridColumns: boolean
  showGridRows: boolean
  showHorizontalCrosshair: boolean
  showTooltip: boolean
  showVerticalCrosshair: boolean
  snapTooltipToDatumX: boolean
  snapTooltipToDatumY: boolean
  stackOffset?: 'wiggle' | 'expand' | 'diverging' | 'silhouette'
  theme: XYChartTheme
  xAxisOrientation: 'top' | 'bottom'
  yAxisOrientation: 'left' | 'right'
} & ReturnType<typeof getAnimatedOrUnanimatedComponents>

export type ControlsProps = {
  children: (props: ProvidedProps) => React.ReactNode
  data: ITimeFrameData[]
  // TODO add a type for it
  metricsToShow: any
}
