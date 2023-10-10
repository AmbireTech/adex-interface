import { createStyles } from '@mantine/core'
import { ITimeFrameData, Metrics, XYChartProps } from 'types'
import ChartControls from './Chart'
import CustomChartBackground from './CustomChartBackground'

const updateTooltipData = (obj: any, values: any) => {
  const keys = Object.keys(obj)
  keys.forEach((key) => {
    const value = obj[key]
    if (value && typeof value === 'object') {
      updateTooltipData(value, values)
    } else if (Object.prototype.hasOwnProperty.call(values, key)) {
      // eslint-disable-next-line
      obj[key] = values[key]
    }
  })
}

const useStyles = createStyles((theme) => ({
  row: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    fontWeight: 'normal',
    color: theme.colors.mainText[theme.fn.primaryShade()]
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: theme.spacing.xs
  },
  hidden: {
    display: 'none'
  }
}))

const TimeFrameChart = ({ height, width, timeFrameData, metricsToShow }: XYChartProps) => {
  const { classes } = useStyles()
  return (
    <ChartControls data={timeFrameData} metricsToShow={metricsToShow}>
      {({
        accessors,
        animationTrajectory,
        config,
        curve,
        data,
        editAnnotationLabelPosition,
        numTicks,
        renderAreaSeries,
        renderBarGroup,
        enableTooltipGlyph,
        renderTooltipGlyph,
        renderHorizontally,
        sharedTooltip,
        showGridColumns,
        showGridRows,
        showHorizontalCrosshair,
        showTooltip,
        showVerticalCrosshair,
        snapTooltipToDatumX,
        snapTooltipToDatumY,
        stackOffset,
        theme,
        xAxisOrientation,
        yAxisOrientation,
        AreaSeries,
        Axis,
        Grid,
        Tooltip,
        XYChart
      }) => (
        <XYChart
          theme={theme}
          xScale={config.x}
          yScale={config.y}
          height={Math.min(400, height)}
          width={width}
          captureEvents={!editAnnotationLabelPosition}
        >
          <CustomChartBackground />
          <Grid
            key={`grid-${animationTrajectory}`} // force animate on update
            rows={showGridRows}
            columns={showGridColumns}
            animationTrajectory={animationTrajectory}
            numTicks={numTicks}
          />
          {renderAreaSeries && (
            <>
              <AreaSeries
                className={!metricsToShow.impressions ? classes.hidden : undefined}
                dataKey="Impressions"
                data={data}
                xAccessor={accessors.x.Impressions}
                yAccessor={accessors.y.Impressions}
                fillOpacity={0.4}
                curve={curve}
              />
              <AreaSeries
                className={!metricsToShow.clickAndCRT ? classes.hidden : undefined}
                dataKey="Clicks and CRT"
                data={data}
                xAccessor={accessors.x['Clicks and CRT']}
                yAccessor={accessors.y['Clicks and CRT']}
                fillOpacity={0.4}
                curve={curve}
              />
              <AreaSeries
                className={!metricsToShow.averageCPM ? classes.hidden : undefined}
                dataKey="Average CPM"
                data={data}
                xAccessor={accessors.x['Average CPM']}
                yAccessor={accessors.y['Average CPM']}
                fillOpacity={0.4}
                curve={curve}
              />
              <AreaSeries
                className={!metricsToShow.spent ? classes.hidden : undefined}
                dataKey="Total spent"
                data={data}
                xAccessor={accessors.x['Total spent']}
                yAccessor={accessors.y['Total spent']}
                fillOpacity={0.4}
                curve={curve}
              />
            </>
          )}
          <Axis
            key={`time-axis-${animationTrajectory}-${renderHorizontally}`}
            orientation={renderHorizontally ? yAxisOrientation : xAxisOrientation}
            numTicks={numTicks}
            animationTrajectory={animationTrajectory}
          />
          <Axis
            key={`temp-axis-${animationTrajectory}-${renderHorizontally}`}
            orientation={renderHorizontally ? xAxisOrientation : yAxisOrientation}
            numTicks={numTicks}
            animationTrajectory={animationTrajectory}
            // values don't make sense in stream graph
            tickFormat={stackOffset === 'wiggle' ? () => '' : undefined}
          />
          {showTooltip && (
            <Tooltip<ITimeFrameData>
              showHorizontalCrosshair={showHorizontalCrosshair}
              showVerticalCrosshair={showVerticalCrosshair}
              snapTooltipToDatumX={snapTooltipToDatumX}
              snapTooltipToDatumY={snapTooltipToDatumY}
              showDatumGlyph={(snapTooltipToDatumX || snapTooltipToDatumY) && !renderBarGroup}
              showSeriesGlyphs={sharedTooltip && !renderBarGroup}
              renderGlyph={enableTooltipGlyph ? renderTooltipGlyph : undefined}
              renderTooltip={({ tooltipData, colorScale }) => {
                const copiedData = JSON.parse(JSON.stringify(tooltipData)) as typeof tooltipData
                const foundTimeFrameItem = timeFrameData.find(
                  (i) => i.date === copiedData?.datumByKey.Impressions.datum.date
                )
                updateTooltipData(copiedData, foundTimeFrameItem)

                return (
                  <div>
                    {(
                      (sharedTooltip
                        ? Object.keys(copiedData?.datumByKey ?? {})
                        : [copiedData?.nearestDatum?.key]
                      ).filter((item) => item) as Metrics[]
                    ).map((item) => {
                      const value =
                        copiedData?.nearestDatum?.datum &&
                        accessors[renderHorizontally ? 'x' : 'y'][item](
                          copiedData?.nearestDatum?.datum
                        )

                      const dotColor = colorScale?.(item)

                      return (
                        dotColor && (
                          <div className={classes.row} key={item}>
                            <span
                              className={classes.dot}
                              style={{
                                backgroundColor: dotColor
                              }}
                            />
                            <span>
                              {item}: {value == null || Number.isNaN(value) ? '–' : value}
                            </span>
                          </div>
                        )
                      )
                    })}
                  </div>
                )
              }}
            />
          )}
        </XYChart>
      )}
    </ChartControls>
  )
}

export default TimeFrameChart
