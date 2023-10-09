import { useMantineTheme } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
import { XYChartTheme, buildChartTheme } from '@visx/xychart'
import { GlyphProps } from '@visx/xychart/lib/types'
import { ControlsProps, DataKey, ITimeFrameData, ProvidedProps } from 'types'
import { GlyphStar } from '@visx/glyph'
import { curveLinear } from '@visx/curve'
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

const ChartControls = ({ children, data, metricsToShow }: ControlsProps) => {
  const maxImpressions = useMemo(() => Math.max(...data.map((i) => i.impressions)), [data])
  const maxClickAndCRT = useMemo(() => Math.max(...data.map((i) => i.clickAndCRT)), [data])
  const maxAverageCPM = useMemo(() => Math.max(...data.map((i) => i.averageCPM)), [data])
  const maxSpent = useMemo(() => Math.max(...data.map((i) => i.spent)), [data])

  const scaledData = useMemo(
    () =>
      data.map((item) => {
        return {
          ...item,
          impressions: Math.log(1 + item.impressions) / Math.log(1 + maxImpressions),
          clickAndCRT: Math.log(1 + item.clickAndCRT) / Math.log(1 + maxClickAndCRT),
          averageCPM: Math.log(1 + item.averageCPM) / Math.log(1 + maxAverageCPM),
          spent: Math.log(1 + item.spent) / Math.log(1 + maxSpent)
        }
      }),
    [data, maxAverageCPM, maxClickAndCRT, maxImpressions, maxSpent]
  )

  const appTheme = useMantineTheme()
  const colors = useMemo(
    () =>
      [
        metricsToShow.impressions && appTheme.colors.chartColorOne[appTheme.fn.primaryShade()],
        metricsToShow.clickAndCRT && appTheme.colors.chartColorTwo[appTheme.fn.primaryShade()],
        metricsToShow.averageCPM && appTheme.colors.chartColorThree[appTheme.fn.primaryShade()],
        metricsToShow.spent && appTheme.colors.chartColorFour[appTheme.fn.primaryShade()]
      ].filter((i) => !!i),
    [
      metricsToShow.impressions,
      metricsToShow.clickAndCRT,
      metricsToShow.averageCPM,
      metricsToShow.spent,
      appTheme.colors.chartColorOne,
      appTheme.colors.chartColorTwo,
      appTheme.colors.chartColorThree,
      appTheme.colors.chartColorFour,
      appTheme.fn
    ]
  )

  const theme = buildChartTheme({
    backgroundColor: 'white',
    colors,
    gridColor: '#336d88',
    gridColorDark: '#1d1b38',
    svgLabelBig: { fill: '#1d1b38' },
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
        ...getAnimatedOrUnanimatedComponents(true)
      })}
    </>
  )
}

export default ChartControls
