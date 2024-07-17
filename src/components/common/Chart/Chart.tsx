import { getPrimaryShade, lighten, useMantineTheme } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
import { XYChartTheme, buildChartTheme } from '@visx/xychart'
import { GlyphProps } from '@visx/xychart/lib/types'
import { ControlsProps, DataKey, FilteredAnalytics, ProvidedProps } from 'types'
import { GlyphStar } from '@visx/glyph'
import { curveLinear } from '@visx/curve'
import { RenderTooltipGlyphProps } from '@visx/xychart/lib/components/Tooltip'
import { useColorScheme } from '@mantine/hooks'
import getAnimatedOrUnanimatedComponents from './getAnimatedOrUnanimatedComponents'

const dateScaleConfig = { type: 'band', paddingInner: 0.3 } as const
const temperatureScaleConfig = { type: 'linear' } as const
const numTicks = 4
const defaultAnnotationDataIndex = 13
const selectedDatumPatternId = 'xychart-selected-datum'

const getDate = (d: FilteredAnalytics) => d.segment
const getImpressions = (d: FilteredAnalytics) => Number(d.impressions || 0)
const getClicks = (d: FilteredAnalytics) => Number(d.clicks || 0)
const getCtr = (d: FilteredAnalytics) => Number(d.ctr || 0)
const getAverageCPM = (d: FilteredAnalytics) => Number(d.avgCpm || 0)
const getSpent = (d: FilteredAnalytics) => Number(d.paid || 0)

type Range = {
  min: number
  max: number
}
const normalize = (num: number, range: Range): number => {
  // return (num - range.min) / (range.max - range.min)
  // NOTE: just like if there is 0 in the range - this the min not 0 val will not start from 0
  // TODO: better normalization
  return num / range.max
}

const getRange = (dataArray: number[]): { min: number; max: number } => {
  const min = Math.min(...dataArray)
  const max = Math.max(...dataArray)
  return { min, max }
}

const ChartControls = ({ children, data, metricsToShow }: ControlsProps) => {
  const impRange = useMemo(() => getRange(data.map((i) => i.impressions || 0)), [data])
  const clicksRange = useMemo(() => getRange(data.map((i) => i.clicks || 0)), [data])
  const avgCpmRange = useMemo(() => getRange(data.map((i) => i.avgCpm || 0)), [data])
  const paidRange = useMemo(() => getRange(data.map((i) => i.paid || 0)), [data])

  const scaledData = useMemo(
    () =>
      data.map((item) => {
        const normalized = {
          ...item,
          impressions: normalize(item.impressions || 0, impRange),
          clicks: normalize(item.clicks || 0, clicksRange),
          avgCpm: normalize(item.avgCpm || 0, avgCpmRange),
          paid: normalize(item.paid || 0, paidRange)
        }

        return normalized
      }),
    [avgCpmRange, clicksRange, data, impRange, paidRange]
  )

  const appTheme = useMantineTheme()
  const colorScheme = useColorScheme()
  const primaryShade = useMemo(
    () => getPrimaryShade(appTheme, colorScheme),
    [appTheme, colorScheme]
  )

  const colors = useMemo(
    () =>
      [
        metricsToShow.impressions && appTheme.colors.chartColorOne[primaryShade],
        metricsToShow.clicks && appTheme.colors.chartColorTwo[primaryShade],
        metricsToShow.avgCpm && appTheme.colors.chartColorThree[primaryShade],
        metricsToShow.paid && appTheme.colors.chartColorFour[primaryShade]
      ].map((x) => x?.toString() || ''),
    [
      metricsToShow.impressions,
      metricsToShow.clicks,
      metricsToShow.avgCpm,
      metricsToShow.paid,
      appTheme.colors.chartColorOne,
      appTheme.colors.chartColorTwo,
      appTheme.colors.chartColorThree,
      appTheme.colors.chartColorFour,
      primaryShade
    ]
  )

  const gridColor = useMemo(
    () => lighten(appTheme.colors.mainText[primaryShade], appTheme.other.shades.lighten.lighter),
    [appTheme.colors.mainText, appTheme.other.shades.lighten.lighter, primaryShade]
  )

  const theme = buildChartTheme({
    backgroundColor: appTheme.colors.mainBackground[primaryShade],
    colors,
    gridColor,
    gridColorDark: gridColor,
    svgLabelBig: { fill: appTheme.colors.mainBackground[primaryShade] },
    tickLength: 8
  }) as XYChartTheme
  const [showGridRows, showGridColumns] = [true, false]
  const [annotationDataKey, setAnnotationDataKey] =
    useState<ProvidedProps['annotationDataKey']>(null)
  const [annotationDataIndex] = useState(defaultAnnotationDataIndex)
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
    }: GlyphProps<FilteredAnalytics>) => {
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
    }: RenderTooltipGlyphProps<FilteredAnalytics>) => {
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
    (dataKey: DataKey) => (d: FilteredAnalytics) =>
      annotationDataKey === dataKey && d === data[annotationDataIndex]
        ? `url(#${selectedDatumPatternId})`
        : null,
    [annotationDataIndex, annotationDataKey, data]
  )

  const accessors = {
    x: {
      impressions: getDate,
      clicks: getDate,
      avgCpm: getDate,
      paid: getDate,
      ctr: getDate
    },
    y: {
      impressions: getImpressions,
      clicks: getClicks,
      avgCpm: getAverageCPM,
      paid: getSpent,
      ctr: getCtr
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
        setAnnotationDataKey,
        sharedTooltip: true,
        showGridColumns,
        showGridRows,
        showHorizontalCrosshair: false,
        showTooltip: true,
        showVerticalCrosshair: true,
        snapTooltipToDatumX: true,
        snapTooltipToDatumY: false,
        theme,
        xAxisOrientation: 'bottom',
        yAxisOrientation: 'left',
        ...getAnimatedOrUnanimatedComponents(false)
      })}
    </>
  )
}

export default ChartControls
