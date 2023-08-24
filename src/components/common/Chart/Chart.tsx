import { createStyles } from '@mantine/core'
import React, { useCallback, useState } from 'react'
import { XYChartTheme } from '@visx/xychart'
import { PatternLines } from '@visx/pattern'
import { GlyphProps } from '@visx/xychart/lib/types'
import { AnimationTrajectory } from '@visx/react-spring/lib/types'
import cityTemperature, { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature'
import { GlyphStar } from '@visx/glyph'
import { curveLinear, curveStep, curveCardinal } from '@visx/curve'
import { RenderTooltipGlyphProps } from '@visx/xychart/lib/components/Tooltip'
import customTheme from './customTheme'
import getAnimatedOrUnanimatedComponents from './getAnimatedOrUnanimatedComponents'

const dateScaleConfig = { type: 'band', paddingInner: 0.3 } as const
const temperatureScaleConfig = { type: 'linear' } as const
const numTicks = 4
const data = cityTemperature.slice(225, 275)

const getDate = (d: CityTemperature) => d.date
const getSfTemperature = (d: CityTemperature) => Number(d['San Francisco'])
const getNyTemperature = (d: CityTemperature) => Number(d['New York'])
const getAustinTemperature = (d: CityTemperature) => Number(d.Austin)
const defaultAnnotationDataIndex = 13
const selectedDatumPatternId = 'xychart-selected-datum'

type Accessor = (d: CityTemperature) => number | string

interface Accessors {
  'San Francisco': Accessor
  'New York': Accessor
  Austin: Accessor
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
  annotationDatum?: CityTemperature
  annotationLabelPosition: { dx: number; dy: number }
  annotationType?: 'line' | 'circle'
  colorAccessorFactory: (key: DataKey) => (d: CityTemperature) => string | null
  config: {
    x: SimpleScaleConfig
    y: SimpleScaleConfig
  }
  curve: typeof curveLinear | typeof curveCardinal | typeof curveStep
  data: CityTemperature[]
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
  renderGlyph: React.FC<GlyphProps<CityTemperature>>
  renderGlyphSeries: boolean
  enableTooltipGlyph: boolean
  renderTooltipGlyph: React.FC<RenderTooltipGlyphProps<CityTemperature>>
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

export default function ExampleControls({ children }: ControlsProps) {
  const theme = customTheme as XYChartTheme
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
    }: GlyphProps<CityTemperature>) => {
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
    }: RenderTooltipGlyphProps<CityTemperature>) => {
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
    (dataKey: DataKey) => (d: CityTemperature) =>
      annotationDataKey === dataKey && d === data[annotationDataIndex]
        ? `url(#${selectedDatumPatternId})`
        : null,
    [annotationDataIndex, annotationDataKey]
  )

  const accessors = {
    x: {
      'San Francisco': getDate,
      'New York': getDate,
      Austin: getDate
    },
    y: {
      'San Francisco': getSfTemperature,
      'New York': getNyTemperature,
      Austin: getAustinTemperature
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
        animationTrajectory: 'min',
        annotationDataKey,
        annotationDatum: data[annotationDataIndex],
        annotationLabelPosition,
        annotationType: 'circle',
        colorAccessorFactory,
        config,
        curve: curveCardinal,
        data,
        editAnnotationLabelPosition: false,
        numTicks,
        renderBarGroup: false,
        renderBarSeries: false,
        renderBarStack: false,
        renderGlyphSeries: false,
        renderGlyph,
        enableTooltipGlyph: false,
        renderTooltipGlyph,
        renderHorizontally: false,
        renderAreaSeries: false,
        renderAreaStack: true,
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
