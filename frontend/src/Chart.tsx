
import type { Metric } from './types'

interface Props {
  data: Metric[]
}

function MetricsChart({ data }: Props) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1)
  const height = data.length * 20
  const barMaxWidth = 200

  return (
    <svg width="100%" height={height} className="chart">
      {data.map((d, i) => {
        const width = (Math.abs(d.value) / max) * barMaxWidth
        const y = i * 20
        return (
          <g key={d.label} transform={`translate(100, ${y})`}>
            <rect width={width} height="12" fill="#5c6bc0" />
            <text x={-5} y={10} fontSize="10" textAnchor="end">
              {d.label}
            </text>
            <text x={width + 5} y={10} fontSize="10">
              {d.value.toFixed(2)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default MetricsChart
