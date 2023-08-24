import { buildChartTheme } from '@visx/xychart'

// TODO: Change the colors
export default buildChartTheme({
  backgroundColor: 'white',
  colors: ['#6437DE', '#21B7DE', '#DE8E43'],
  gridColor: '#336d88',
  gridColorDark: '#1d1b38',
  svgLabelBig: { fill: '#1d1b38' },
  tickLength: 8
})
