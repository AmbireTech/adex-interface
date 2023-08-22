import * as topojson from 'topojson-client'
import { scaleQuantize } from '@visx/scale'
import { CustomProjection } from '@visx/geo'
import { Zoom } from '@visx/zoom'
import { geoNaturalEarth1 } from 'd3-geo'
import { Tooltip, createStyles } from '@mantine/core'
import { IRegion } from 'types'
import topology from './world-topo.json'

export type GeoCustomProps = {
  width: number
  height: number
  events?: boolean
  regions?: IRegion[]
}

interface FeatureShape {
  type: 'Feature'
  id: string
  geometry: { coordinates: [number, number][][]; type: 'Polygon' }
  properties: { name: string }
}

export const background = '#252b7e'

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
    '#019ece',
    '#f4448b',
    '#fccf35',
    '#82b75d',
    '#b33c88',
    '#fc5e2f',
    '#f94b3a',
    '#f63a48',
    '#dde1fe',
    '#8993f9',
    '#b6c8fb',
    '#65fe8d'
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
  btn: {
    margin: 0,
    textAlign: 'center',
    border: 'none',
    background: '#dde1fe',
    color: '#222',
    padding: '0 4px',
    borderTop: '1px solid #8993f9'
  },
  btnLg: {
    fontSize: '12px',
    lineHeight: 1,
    padding: '4px'
  },
  btnZoom: {
    width: '26px',
    fontSize: '22px'
  },
  btnBottom: {
    marginBottom: '1rem'
  },
  controls: {
    position: 'absolute',
    bottom: '20px',
    right: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flexEnd'
  },
  label: {
    fontSize: '12px'
  }
}))

export default function GeoCustom({ width, height, events = true, regions }: GeoCustomProps) {
  const { classes, cx } = useStyles()
  const centerX = width / 2
  const centerY = height / 2
  const initialScale = (width / 1100) * 100

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
                      {customProjection.features.map(({ feature, path }) => {
                        const selectedRegion = regions?.find(
                          (region) => region.country === feature.properties.name
                        )

                        const tooltipText = selectedRegion
                          ? `${selectedRegion.country} Impressions: ${selectedRegion.impressions}\n Clicks: ${selectedRegion.clicks}\n Share: ${selectedRegion.share} %\n CTR: ${selectedRegion.ctrPercents} %`
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

              {/** intercept all mouse events */}
              {/* <rect
                x={0}
                y={0}
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd()
                }}
              /> */}
            </svg>
            {events && (
              <div className={classes.controls}>
                <button
                  type="button"
                  className={cx(classes.btn, classes.btnZoom)}
                  onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
                >
                  +
                </button>
                <button
                  type="button"
                  className={cx(classes.btn, classes.btnZoom, classes.btnBottom)}
                  onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
                >
                  -
                </button>
                <button
                  type="button"
                  className={cx(classes.btn, classes.btnLg)}
                  onClick={zoom.reset}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )
      }}
    </Zoom>
  )
}
