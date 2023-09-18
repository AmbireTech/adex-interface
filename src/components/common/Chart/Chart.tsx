import { createStyles, useMantineTheme } from '@mantine/core'
import React, { useCallback, useMemo, useState } from 'react'
import { XYChartTheme, buildChartTheme } from '@visx/xychart'
import { PatternLines } from '@visx/pattern'
import { GlyphProps } from '@visx/xychart/lib/types'
import { AnimationTrajectory } from '@visx/react-spring/lib/types'
import { ITimeFrameData } from 'types'
import { GlyphStar } from '@visx/glyph'
import { curveLinear, curveStep, curveCardinal } from '@visx/curve'
import { RenderTooltipGlyphProps } from '@visx/xychart/lib/components/Tooltip'
import getAnimatedOrUnanimatedComponents from './getAnimatedOrUnanimatedComponents'

const dateScaleConfig = { type: 'band', paddingInner: 0.3 } as const
const temperatureScaleConfig = { type: 'linear' } as const
const numTicks = 4

const getDate = (d: ITimeFrameData) => d.date
const getImpressions = (d: ITimeFrameData) => Number(d.impressions)
const getClickAndCRT = (d: ITimeFrameData) => Number(d.clickAndCRT)
const getAverageCPM = (d: ITimeFrameData) => Number(d.averageCPM)
const getSpent = (d: ITimeFrameData) => Number(d.spent)
const defaultAnnotationDataIndex = 13
const selectedDatumPatternId = 'xychart-selected-datum'

type Accessor = (d: ITimeFrameData) => number | string

interface Accessors {
  Impressions: Accessor
  'Clicks and CRT': Accessor
  'Average CPM': Accessor
  'Total spent': Accessor
}

type DataKey = keyof Accessors

type SimpleScaleConfig = { type: 'band' | 'linear'; paddingInner?: number }

type ProvidedProps = {
  accessors: {
    x: Accessors
    y: Accessors
    date: Accessor
  }
  animationTrajectory?: AnimationTrajectory
  annotationDataKey: DataKey | null
  annotationDatum?: ITimeFrameData
  annotationLabelPosition: { dx: number; dy: number }
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
  setAnnotationDataIndex: (index: number) => void
  setAnnotationDataKey: (key: DataKey | null) => void
  setAnnotationLabelPosition: (position: { dx: number; dy: number }) => void
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

type ControlsProps = {
  children: (props: ProvidedProps) => React.ReactNode
  data: ITimeFrameData[]
}

const useStyles = createStyles(() => ({
  controls: {
    fontSize: 13,
    lineHeight: '1.5em'
  },
  label: {
    fontSize: '12px'
  },
  patternLines: {
    position: 'absolute',
    pointerEvents: 'none',
    opacity: 0
  }
}))

export default function ChartControls({ children, data }: ControlsProps) {
  const maxImpressions = useMemo(() => Math.max(...data.map((i) => i.impressions)), [data])
  const maxClickAndCRT = useMemo(() => Math.max(...data.map((i) => i.clickAndCRT)), [data])
  const maxAverageCPM = useMemo(() => Math.max(...data.map((i) => i.averageCPM)), [data])
  const maxSpent = useMemo(() => Math.max(...data.map((i) => i.spent)), [data])

  const scaledData = useMemo(
    () =>
      data.map((item) => {
        return {
          ...item,
          impressions:
            item.impressions && Math.log(1 + item.impressions) / Math.log(1 + maxImpressions),
          clickAndCRT:
            item.clickAndCRT && Math.log(1 + item.clickAndCRT) / Math.log(1 + maxClickAndCRT),
          averageCPM:
            item.averageCPM && Math.log(1 + item.averageCPM) / Math.log(1 + maxAverageCPM),
          spent: item.spent && Math.log(1 + item.spent) / Math.log(1 + maxSpent)
        }
      }),
    [data, maxAverageCPM, maxClickAndCRT, maxImpressions, maxSpent]
  )

  const appTheme = useMantineTheme()
  const theme = buildChartTheme({
    backgroundColor: 'white',
    colors: [
      appTheme.colors.chartColorOne[appTheme.fn.primaryShade()],
      appTheme.colors.chartColorTwo[appTheme.fn.primaryShade()],
      appTheme.colors.chartColorThree[appTheme.fn.primaryShade()],
      appTheme.colors.chartColorFour[appTheme.fn.primaryShade()]
    ],
    gridColor: '#336d88',
    gridColorDark: '#1d1b38',
    svgLabelBig: { fill: '#1d1b38' },
    tickLength: 8
  }) as XYChartTheme
  const { classes } = useStyles()
  const [showGridRows, showGridColumns] = [true, false]
  const [annotationDataKey, setAnnotationDataKey] =
    useState<ProvidedProps['annotationDataKey']>(null)

  const [annotationLabelPosition, setAnnotationLabelPosition] = useState({ dx: -40, dy: -20 })
  const [annotationDataIndex, setAnnotationDataIndex] = useState(defaultAnnotationDataIndex)
  const glyphOutline = theme.gridStyles.stroke
  const renderGlyph = useCallback(
    ({
      x,
      y,
      size,
      color,
      onPointerMove,
      onPointerOut,
      onPointerUp
    }: GlyphProps<ITimeFrameData>) => {
      const handlers = { onPointerMove, onPointerOut, onPointerUp }

      return (
        <GlyphStar
          left={x}
          top={y}
          stroke={glyphOutline}
          fill={color}
          size={size * 10}
          {...handlers}
        />
      )
    },
    [glyphOutline]
  )
  const renderTooltipGlyph = useCallback(
    ({
      x,
      y,
      size,
      color,
      onPointerMove,
      onPointerOut,
      onPointerUp
    }: RenderTooltipGlyphProps<ITimeFrameData>) => {
      const handlers = { onPointerMove, onPointerOut, onPointerUp }

      return (
        <GlyphStar
          left={x}
          top={y}
          stroke={glyphOutline}
          fill={color}
          size={size * 10}
          {...handlers}
        />
      )
    },
    [glyphOutline]
  )
  // for series that support it, return a colorAccessor which returns a custom color if the datum is selected
  const colorAccessorFactory = useCallback(
    (dataKey: DataKey) => (d: ITimeFrameData) =>
      annotationDataKey === dataKey && d === data[annotationDataIndex]
        ? `url(#${selectedDatumPatternId})`
        : null,
    [annotationDataIndex, annotationDataKey, data]
  )

  const accessors = {
    x: {
      Impressions: getDate,
      'Clicks and CRT': getDate,
      'Average CPM': getDate,
      'Total spent': getDate
    },
    y: {
      Impressions: getImpressions,
      'Clicks and CRT': getClickAndCRT,
      'Average CPM': getAverageCPM,
      'Total spent': getSpent
    },
    date: getDate
  }

  const config = {
    x: dateScaleConfig,
    y: temperatureScaleConfig
  }

  return (
    <>
      {children({
        accessors,
        animationTrajectory: 'center',
        annotationDataKey,
        annotationDatum: data[annotationDataIndex],
        annotationLabelPosition,
        annotationType: 'circle',
        colorAccessorFactory,
        config,
        curve: curveLinear,
        data: scaledData,
        editAnnotationLabelPosition: false,
        numTicks,
        renderBarGroup: false,
        renderBarSeries: false,
        renderBarStack: false,
        renderGlyph,
        enableTooltipGlyph: false,
        renderTooltipGlyph,
        renderHorizontally: false,
        renderAreaSeries: true,
        renderAreaStack: false,
        renderLineSeries: false,
        setAnnotationDataIndex,
        setAnnotationDataKey,
        setAnnotationLabelPosition,
        sharedTooltip: true,
        showGridColumns,
        showGridRows,
        showHorizontalCrosshair: false,
        showTooltip: true,
        showVerticalCrosshair: true,
        snapTooltipToDatumX: true,
        snapTooltipToDatumY: true,
        // stackOffset,
        theme,
        xAxisOrientation: 'bottom',
        yAxisOrientation: 'left',
        ...getAnimatedOrUnanimatedComponents(true)
      })}
      {/** This style is used for annotated elements via colorAccessor. */}
      <svg className={classes.patternLines}>
        <PatternLines
          id={selectedDatumPatternId}
          width={6}
          height={6}
          orientation={['diagonalRightToLeft']}
          stroke={theme?.axisStyles.x.bottom.axisLine.stroke}
          strokeWidth={1.5}
        />
      </svg>
    </>
  )
}
