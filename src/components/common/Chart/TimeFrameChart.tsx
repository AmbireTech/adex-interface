import { ITimeFrameData } from 'types'
import ChartControls from './Chart'
import CustomChartBackground from './CustomChartBackground'

export type XYChartProps = {
  width: number
  height: number
  timeFrameData: ITimeFrameData[]
  // TODO: Add type for it
  metricsToShow: any
}

type Metrics = 'Impressions' | 'Clicks and CRT' | 'Average CPM' | 'Total spent'

export default function TimeFrameChart({
  height,
  width,
  timeFrameData,
  metricsToShow
}: XYChartProps) {
  console.log('metricsToShow', metricsToShow)
  return (
    <ChartControls data={timeFrameData}>
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
                subtitle={`${annotationDatum.date}, ${annotationDatum[annotationDataKey]}°F`}
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
              renderTooltip={({ tooltipData, colorScale }) => (
                <>
                  {/** date */}
                  {(tooltipData?.nearestDatum?.datum &&
                    accessors.date(tooltipData?.nearestDatum?.datum)) ||
                    'No date'}
                  <br />
                  <br />
                  {/** temperatures */}
                  {(
                    (sharedTooltip
                      ? Object.keys(tooltipData?.datumByKey ?? {})
                      : [tooltipData?.nearestDatum?.key]
                    ).filter((city) => city) as Metrics[]
                  ).map((city) => {
                    const temperature =
                      tooltipData?.nearestDatum?.datum &&
                      accessors[renderHorizontally ? 'x' : 'y'][city](
                        tooltipData?.nearestDatum?.datum
                      )

                    return (
                      <div key={city}>
                        <em
                          style={{
                            color: colorScale?.(city),
                            textDecoration:
                              tooltipData?.nearestDatum?.key === city ? 'underline' : undefined
                          }}
                        >
                          {city}
                        </em>{' '}
                        {temperature == null || Number.isNaN(temperature)
                          ? '–'
                          : `${temperature}° F`}
                      </div>
                    )
                  })}
                </>
              )}
            />
          )}
        </XYChart>
      )}
    </ChartControls>
  )
}
