// import { ITimeFrameData } from '@visx/mock-data/lib/mocks/ITimeFrameData'

import { ITimeFrameData } from 'types'
import ChartControls from './Chart'
import CustomChartBackground from './CustomChartBackground'

export type XYChartProps = {
  width: number
  height: number
  timeFrameData: ITimeFrameData[]
}

// type City = 'San Francisco' | 'New York' | 'Austin'
type Metrics = 'Impressions' | 'Clicks and CRT' | 'Average CPM' | 'Total spent'

export default function TimeFrameChart({ height, width, timeFrameData }: XYChartProps) {
  return (
    <ChartControls data={timeFrameData}>
      {({
        accessors,
        animationTrajectory,
        annotationDataKey,
        annotationDatum,
        annotationLabelPosition,
        annotationType,
        colorAccessorFactory,
        config,
        curve,
        data,
        editAnnotationLabelPosition,
        numTicks,
        renderAreaSeries,
        renderAreaStack,
        renderBarGroup,
        renderBarSeries,
        renderBarStack,
        renderGlyph,
        renderGlyphSeries,
        enableTooltipGlyph,
        renderTooltipGlyph,
        renderHorizontally,
        renderLineSeries,
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
        AreaStack,
        Axis,
        BarGroup,
        BarSeries,
        BarStack,
        GlyphSeries,
        Grid,
        LineSeries,
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
          {renderBarStack && (
            <BarStack offset={stackOffset}>
              <BarSeries
                dataKey="Impressions"
                data={data}
                xAccessor={accessors.x.Impressions}
                yAccessor={accessors.y.Impressions}
              />
              <BarSeries
                dataKey="Clicks and CRT"
                data={data}
                xAccessor={accessors.x['Clicks and CRT']}
                yAccessor={accessors.y['Clicks and CRT']}
              />
              <BarSeries
                dataKey="Average CPM"
                data={data}
                xAccessor={accessors.x['Average CPM']}
                yAccessor={accessors.y['Average CPM']}
              />
            </BarStack>
          )}
          {renderBarGroup && (
            <BarGroup>
              <BarSeries
                dataKey="Impressions"
                data={data}
                xAccessor={accessors.x.Impressions}
                yAccessor={accessors.y.Impressions}
                colorAccessor={colorAccessorFactory('Impressions')}
              />
              <BarSeries
                dataKey="Clicks and CRT"
                data={data}
                xAccessor={accessors.x['Clicks and CRT']}
                yAccessor={accessors.y['Clicks and CRT']}
                colorAccessor={colorAccessorFactory('Clicks and CRT')}
              />
              <BarSeries
                dataKey="Average CPM"
                data={data}
                xAccessor={accessors.x['Average CPM']}
                yAccessor={accessors.y['Average CPM']}
                colorAccessor={colorAccessorFactory('Average CPM')}
              />
            </BarGroup>
          )}
          {renderBarSeries && (
            <BarSeries
              dataKey="Impressions"
              data={data}
              xAccessor={accessors.x.Impressions}
              yAccessor={accessors.y.Impressions}
              colorAccessor={colorAccessorFactory('Impressions')}
            />
          )}
          {renderAreaSeries && (
            <>
              <AreaSeries
                dataKey="Average CPM"
                data={data}
                xAccessor={accessors.x['Average CPM']}
                yAccessor={accessors.y['Average CPM']}
                fillOpacity={0.4}
                curve={curve}
              />
              <AreaSeries
                dataKey="Impressions"
                data={data}
                xAccessor={accessors.x.Impressions}
                yAccessor={accessors.y.Impressions}
                fillOpacity={0.4}
                curve={curve}
              />
              <AreaSeries
                dataKey="Clicks and CRT"
                data={data}
                xAccessor={accessors.x['Clicks and CRT']}
                yAccessor={accessors.y['Clicks and CRT']}
                fillOpacity={0.4}
                curve={curve}
              />
            </>
          )}
          {renderAreaStack && (
            <AreaStack curve={curve} offset={stackOffset} renderLine={stackOffset !== 'wiggle'}>
              <AreaSeries
                dataKey="Average CPM"
                data={data}
                xAccessor={accessors.x['Average CPM']}
                yAccessor={accessors.y['Average CPM']}
                fillOpacity={0.4}
              />
              <AreaSeries
                dataKey="Impressions"
                data={data}
                xAccessor={accessors.x.Impressions}
                yAccessor={accessors.y.Impressions}
                fillOpacity={0.4}
              />
              <AreaSeries
                dataKey="Clicks and CRT"
                data={data}
                xAccessor={accessors.x['Clicks and CRT']}
                yAccessor={accessors.y['Clicks and CRT']}
                fillOpacity={0.4}
              />
            </AreaStack>
          )}
          {renderLineSeries && (
            <>
              <LineSeries
                dataKey="Average CPM"
                data={data}
                xAccessor={accessors.x['Average CPM']}
                yAccessor={accessors.y['Average CPM']}
                curve={curve}
              />
              {!renderBarSeries && (
                <LineSeries
                  dataKey="Impressions"
                  data={data}
                  xAccessor={accessors.x.Impressions}
                  yAccessor={accessors.y.Impressions}
                  curve={curve}
                />
              )}
              <LineSeries
                dataKey="Clicks and CRT"
                data={data}
                xAccessor={accessors.x['Clicks and CRT']}
                yAccessor={accessors.y['Clicks and CRT']}
                curve={curve}
              />
            </>
          )}
          {renderGlyphSeries && (
            <GlyphSeries
              dataKey="Clicks and CRT"
              data={data}
              xAccessor={accessors.x['Clicks and CRT']}
              yAccessor={accessors.y['Clicks and CRT']}
              renderGlyph={renderGlyph}
              colorAccessor={colorAccessorFactory('Clicks and CRT')}
            />
          )}
          <Axis
            key={`time-axis-${animationTrajectory}-${renderHorizontally}`}
            orientation={renderHorizontally ? yAxisOrientation : xAxisOrientation}
            numTicks={numTicks}
            animationTrajectory={animationTrajectory}
          />
          <Axis
            key={`temp-axis-${animationTrajectory}-${renderHorizontally}`}
            label={stackOffset == null ? 'Temperature (°F)' : 'Fraction of total temperature'}
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
