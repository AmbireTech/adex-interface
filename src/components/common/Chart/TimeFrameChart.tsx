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
  }
}))

const TimeFrameChart = ({ height, width, timeFrameData, metricsToShow }: XYChartProps) => {
  const { classes } = useStyles()
  return (
    <ChartControls data={timeFrameData} metricsToShow={metricsToShow}>
      {({
        accessors,
        animationTrajectory,
        annotationDataKey,
        annotationDatum,
        annotationLabelPosition,
        annotationType,
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
        setAnnotationDataIndex,
        setAnnotationDataKey,
        setAnnotationLabelPosition,
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
        Annotation,
        AreaSeries,
        Axis,
        Grid,
        AnnotationCircleSubject,
        AnnotationConnector,
        AnnotationLabel,
        AnnotationLineSubject,
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
          onPointerUp={(d) => {
            setAnnotationDataKey(
              d.key as 'Impressions' | 'Clicks and CRT' | 'Average CPM' | 'Total spent'
            )
            setAnnotationDataIndex(d.index)
          }}
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
              {metricsToShow.impressions && (
                <AreaSeries
                  dataKey="Impressions"
                  data={data}
                  xAccessor={accessors.x.Impressions}
                  yAccessor={accessors.y.Impressions}
                  fillOpacity={0.4}
                  curve={curve}
                />
              )}
              {metricsToShow.clickAndCRT && (
                <AreaSeries
                  dataKey="Clicks and CRT"
                  data={data}
                  xAccessor={accessors.x['Clicks and CRT']}
                  yAccessor={accessors.y['Clicks and CRT']}
                  fillOpacity={0.4}
                  curve={curve}
                />
              )}
              {metricsToShow.averageCPM && (
                <AreaSeries
                  dataKey="Average CPM"
                  data={data}
                  xAccessor={accessors.x['Average CPM']}
                  yAccessor={accessors.y['Average CPM']}
                  fillOpacity={0.4}
                  curve={curve}
                />
              )}
              {metricsToShow.spent && (
                <AreaSeries
                  dataKey="Total spent"
                  data={data}
                  xAccessor={accessors.x['Total spent']}
                  yAccessor={accessors.y['Total spent']}
                  fillOpacity={0.4}
                  curve={curve}
                />
              )}
            </>
          )}
          <Axis
            key={`time-axis-${animationTrajectory}-${renderHorizontally}`}
            orientation={renderHorizontally ? yAxisOrientation : xAxisOrientation}
            numTicks={numTicks + 5}
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
          {annotationDataKey && annotationDatum && (
            <Annotation
              dataKey={annotationDataKey}
              datum={annotationDatum}
              dx={annotationLabelPosition.dx}
              dy={annotationLabelPosition.dy}
              editable={editAnnotationLabelPosition}
              canEditSubject={false}
              onDragEnd={({ dx, dy }) => setAnnotationLabelPosition({ dx, dy })}
            >
              <AnnotationConnector />
              {annotationType === 'circle' ? (
                <AnnotationCircleSubject />
              ) : (
                <AnnotationLineSubject />
              )}
              <AnnotationLabel
                title={annotationDataKey}
                subtitle={`${annotationDatum.date}, ${annotationDatum[annotationDataKey]}`}
                width={135}
                backgroundProps={{
                  stroke: theme.gridStyles.stroke,
                  strokeOpacity: 0.5,
                  fillOpacity: 0.8
                }}
              />
            </Annotation>
          )}
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

                      return (
                        <div className={classes.row} key={item}>
                          <span
                            className={classes.dot}
                            style={{
                              backgroundColor: colorScale?.(item)
                            }}
                          />
                          <span>
                            {item}: {value == null || Number.isNaN(value) ? '–' : value}
                          </span>
                        </div>
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
