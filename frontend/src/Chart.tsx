
import type { Metric } from './types'

interface Props {
  data: Metric[]
}

function MetricsChart({ data }: Props) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1)
  const height = data.length * 20
  const barMaxWidth = 200

  return (
    <svg width="100%" height={height + 20} className="chart">
      {data.map((d, i) => {
        const width = (Math.abs(d.value) / max) * barMaxWidth
        const y = i * 20
        return (
          <g key={d.label} transform={`translate(100, ${y})`}>
            <title>{`${d.label}: ${d.value.toFixed(2)}`}</title>
            <rect width={width} height="12" fill="#5c6bc0" />
            <text x={-5} y={10} fontSize="10" textAnchor="end" fill="currentColor">
              {d.label}
            </text>
            <text x={width + 5} y={10} fontSize="10" fill="currentColor">
              {d.value.toFixed(2)}
            </text>
          </g>
        )
      })}
      <text
        x={barMaxWidth / 2 + 100}
        y={height + 15}
        fontSize="10"
        textAnchor="middle"
        fill="currentColor"
      >
        Value
      </text>
    </svg>
  )
}

export default MetricsChart
