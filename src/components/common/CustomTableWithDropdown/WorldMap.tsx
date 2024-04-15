import { useMemo } from 'react'
import * as topojson from 'topojson-client'
import { scaleQuantize } from '@visx/scale'
import { CustomProjection, Graticule } from '@visx/geo'
import { Zoom } from '@visx/zoom'
import { geoNaturalEarth1 } from 'd3-geo'
import { Tooltip, createStyles } from '@mantine/core'
import { BaseAnalyticsData } from 'types'
import topology from './world-topo.json'

export type GeoCustomProps = {
  width: number
  height: number
  regions?: BaseAnalyticsData[]
}

interface FeatureShape {
  type: 'Feature'
  id: string
  geometry: { coordinates: [number, number][][]; type: 'Polygon' }
  properties: { name: string }
}

export const background = 'white'

// @ts-expect-error
const world = topojson.feature(topology, topology.objects.units) as {
  type: 'FeatureCollection'
  features: FeatureShape[]
}

const color = scaleQuantize({
  domain: [
    Math.min(...world.features.map((f) => f.geometry.coordinates.length)),
    Math.max(...world.features.map((f) => f.geometry.coordinates.length))
  ],
  range: [
    '#EDEDFC',
    '#C8C9F8',
    '#AEB1F8',
    '#939AF5',
    '#7484F3',
    '#4E6FF1',
    '#2C5CDE',
    '#224AB5',
    '#19388F',
    '#142867',
    '#0E1942'
  ]
})

const useStyles = createStyles(() => ({
  container: {
    position: 'relative'
  },
  svg: {
    cursor: 'grab',
    touchAction: 'none'
  },
  dragging: {
    cursor: 'grabbing'
  },
  label: {
    fontSize: '12px'
  }
}))

export default function GeoCustom({ width, height, regions }: GeoCustomProps) {
  const { classes } = useStyles()
  const centerX = useMemo(() => width / 2, [width])
  const centerY = useMemo(() => height / 2.5, [height])
  const initialScale = useMemo(() => width / 6, [width])

  return width < 10 ? null : (
    <Zoom<SVGSVGElement>
      width={width}
      height={height}
      scaleXMin={100}
      scaleXMax={1000}
      scaleYMin={100}
      scaleYMax={1000}
      initialTransformMatrix={{
        scaleX: initialScale,
        scaleY: initialScale,
        translateX: centerX,
        translateY: centerY,
        skewX: 0,
        skewY: 0
      }}
    >
      {(zoom) => {
        return (
          <div className={classes.container}>
            <svg
              width={width}
              height={height}
              className={zoom.isDragging ? classes.dragging : undefined}
              ref={zoom.containerRef}
            >
              <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
              <CustomProjection<FeatureShape>
                projection={geoNaturalEarth1}
                data={world.features}
                scale={zoom.transformMatrix.scaleX}
                translate={[zoom.transformMatrix.translateX, zoom.transformMatrix.translateY]}
              >
                {(customProjection) => {
                  return (
                    <g>
                      <Graticule
                        graticule={(g) => customProjection.path(g) || ''}
                        stroke="#EBEEFA"
                      />
                      {customProjection.features.map(({ feature, path }) => {
                        const selectedRegion = regions?.find(
                          (region) => region.segment === feature.properties.name
                        )

                        const tooltipText = selectedRegion
                          ? `${selectedRegion.segment} Impressions: ${
                              selectedRegion.impressions
                            }\n Clicks: ${selectedRegion.clicks}\n Share: ${'TODO'} %\n CTR: ${
                              selectedRegion.ctr
                            } %`
                          : `${feature.properties.name} Impressions: 0 Clicks: 0 Share: 0 % CTR: 0 %`
                        return (
                          <Tooltip.Floating multiline w={200} label={tooltipText}>
                            <path
                              key={`map-feature-${feature.id}`}
                              d={path || ''}
                              fill={color(selectedRegion?.impressions || 0)}
                              stroke={background}
                              strokeWidth={0.5}
                              onMouseEnter={() => {
                                console.log(`Clicked: ${feature.properties.name} (${feature.id})`)
                              }}
                            />
                          </Tooltip.Floating>
                        )
                      })}
                    </g>
                  )
                }}
              </CustomProjection>
            </svg>
          </div>
        )
      }}
    </Zoom>
  )
}
