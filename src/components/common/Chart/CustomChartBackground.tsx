import React, { useContext } from 'react'
import { DataContext } from '@visx/xychart'

const patternId = 'xy-chart-pattern'

export default function CustomChartBackground() {
  const { theme, margin, width, height, innerWidth, innerHeight } = useContext(DataContext)

  // early return values not available in context
  if (width == null || height == null || margin == null || theme == null || width < 0) return null

  return (
    <>
      <rect x={0} y={0} width={width} height={height} fill={theme?.backgroundColor ?? '#fff'} />
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        fill={`url(#${patternId})`}
        fillOpacity={0.3}
      />
    </>
  )
}
