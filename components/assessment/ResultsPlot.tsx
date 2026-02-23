'use client'

import { AssessmentConfig } from '@/config/assessmentConfig'

interface ResultsPlotProps {
  x: number
  y: number
  config: AssessmentConfig
}

export default function ResultsPlot({ x, y, config }: ResultsPlotProps) {
  const size = 400
  const pad = 16 // keep dot fully inside at extremes

  // Convert coordinates (-1 to 1) to pixel position, with internal padding
  const plotX = pad + ((x + 1) / 2) * (size - 2 * pad)
  const plotY = pad + ((1 - y) / 2) * (size - 2 * pad) // invert Y

  const dim1 = config.dimensions[0]
  const dim2 = config.dimensions[1]
  const styles = config.styleDefinitions

  return (
    <div className="relative mx-auto" style={{ width: `${size + 80}px`, height: `${size + 50}px` }}>
      {/* Y-axis label — outside the plot to the left */}
      <div
        className="absolute text-xs text-gray-500 font-medium flex items-center justify-center"
        style={{
          left: '0px',
          top: '0px',
          width: '70px',
          height: `${size}px`,
        }}
      >
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>
          {dim2.leftLabel} &#8592; &#8594; {dim2.rightLabel}
        </span>
      </div>

      {/* Plot area — shifted right to make room for label */}
      <div
        className="absolute border-2 border-gray-300 bg-gray-50"
        style={{ width: `${size}px`, height: `${size}px`, left: '70px', top: '0px' }}
      >
        {/* Grid lines */}
        <div className="absolute w-full h-0.5 bg-gray-200" style={{ top: '50%' }} />
        <div className="absolute h-full w-0.5 bg-gray-200" style={{ left: '50%' }} />

        {/* Quadrant labels */}
        <div className="absolute text-xs text-gray-400 font-medium" style={{ top: '8px', left: '12px' }}>
          {styles.quadrant2.name}
        </div>
        <div className="absolute text-xs text-gray-400 font-medium" style={{ top: '8px', right: '12px', textAlign: 'right' }}>
          {styles.quadrant1.name}
        </div>
        <div className="absolute text-xs text-gray-400 font-medium" style={{ bottom: '8px', left: '12px' }}>
          {styles.quadrant3.name}
        </div>
        <div className="absolute text-xs text-gray-400 font-medium" style={{ bottom: '8px', right: '12px', textAlign: 'right' }}>
          {styles.quadrant4.name}
        </div>

        {/* User position dot */}
        <div
          className="absolute w-4 h-4 rounded-full transform -translate-x-2 -translate-y-2"
          style={{
            left: `${plotX}px`,
            top: `${plotY}px`,
            background: '#002c5f',
            boxShadow: '0 0 12px rgba(0,44,95,0.5), 0 0 24px rgba(0,44,95,0.25)',
          }}
        />
      </div>

      {/* X-axis label — below the plot */}
      <div
        className="absolute text-xs text-gray-500 font-medium text-center"
        style={{ bottom: '0px', left: '70px', width: `${size}px` }}
      >
        {dim1.leftLabel} &#8592; &#8594; {dim1.rightLabel}
      </div>
    </div>
  )
}
