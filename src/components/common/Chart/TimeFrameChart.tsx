import { Accessors, XYChartProps, BaseAnalyticsData, MetricsToShow } from 'types'
import { createStyles } from '@mantine/emotion'
import ChartControls from './Chart'

const useStyles = createStyles((theme) => ({
  row: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    fontWeight: 'normal',
    color: theme.colors.mainText[3]
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

const metricLabel: { [x in keyof MetricsToShow]?: string } = {
  clicks: 'Clicks',
  impressions: 'Impressions',
  avgCpm: 'Average CPM',
  paid: 'Spend',
  ctr: 'CTR %'
}

const TimeFrameChart = ({ height, width, timeFrameData, metricsToShow }: XYChartProps) => {
  const { classes } = useStyles()
  const filledOpacity = 0.069
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
          {/* <CustomChartBackground /> */}
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
                dataKey="impressions"
                data={data}
                xAccessor={accessors.x.impressions}
                yAccessor={accessors.y.impressions}
                fillOpacity={filledOpacity}
                curve={curve}
              />
              <AreaSeries
                className={!metricsToShow.clicks ? classes.hidden : undefined}
                dataKey="clicks"
                data={data}
                xAccessor={accessors.x.clicks}
                yAccessor={accessors.y.clicks}
                fillOpacity={filledOpacity}
                curve={curve}
              />
              <AreaSeries
                className={!metricsToShow.avgCpm ? classes.hidden : undefined}
                dataKey="avgCpm"
                data={data}
                xAccessor={accessors.x.avgCpm}
                yAccessor={accessors.y.avgCpm}
                fillOpacity={filledOpacity}
                curve={curve}
              />
              <AreaSeries
                className={!metricsToShow.paid ? classes.hidden : undefined}
                dataKey="paid"
                data={data}
                xAccessor={accessors.x.paid}
                yAccessor={accessors.y.paid}
                fillOpacity={filledOpacity}
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
            numTicks={0}
            hideAxisLine
            animationTrajectory={animationTrajectory}
          />
          {showTooltip && (
            <Tooltip<BaseAnalyticsData>
              showHorizontalCrosshair={showHorizontalCrosshair}
              showVerticalCrosshair={showVerticalCrosshair}
              snapTooltipToDatumX={snapTooltipToDatumX}
              snapTooltipToDatumY={snapTooltipToDatumY}
              showDatumGlyph={(snapTooltipToDatumX || snapTooltipToDatumY) && !renderBarGroup}
              showSeriesGlyphs={sharedTooltip && !renderBarGroup}
              renderGlyph={enableTooltipGlyph ? renderTooltipGlyph : undefined}
              renderTooltip={({ tooltipData, colorScale }) => {
                const currentSegment = tooltipData?.nearestDatum?.datum?.segment || ''

                return (
                  <div key={currentSegment}>
                    <span className={classes.row}>{currentSegment}</span>
                    <br />
                    <br />
                    <div />
                    {(
                      (sharedTooltip
                        ? Object.keys(tooltipData?.datumByKey ?? {})
                        : [tooltipData?.nearestDatum?.key]
                      ).filter((item) => item) as (keyof Accessors)[]
                    ).map((item) => {
                      const originalData = timeFrameData?.find(
                        (x) => x.segment === tooltipData?.nearestDatum?.datum?.segment
                      )

                      let value =
                        originalData &&
                        currentSegment &&
                        accessors[renderHorizontally ? 'x' : 'y'][item](originalData)

                      if (item === 'clicks' && value && originalData) {
                        value += ` (CTR: ${accessors[renderHorizontally ? 'x' : 'y'].ctr(
                          originalData
                        )} %)`
                      }
                      const dotColor = colorScale?.(item)

                      return (
                        dotColor !== 'false' && (
                          <div className={classes.row} key={item}>
                            <span
                              className={classes.dot}
                              style={{
                                backgroundColor: dotColor
                              }}
                            />
                            <span>
                              {metricLabel[item]}:{' '}
                              {value == null || Number.isNaN(value) ? '–' : value}
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
