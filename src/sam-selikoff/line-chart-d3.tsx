import React from 'react'
import * as d3 from "d3";
import useMeasure from 'react-use-measure';
import { motion } from 'framer-motion';
export default function LineChartD3() {
  const [ref, bounds] = useMeasure()
  return (
    <div ref={ref} className="relative h-40 w-full">
      <ChartInner width={bounds.width} height={bounds.height} />
    </div>
  )
}


function ChartInner({
  width,
  height
}: {
  width: number
  height: number
}) {
  let dummyData: [number, number][] = [
    [0, 10],
    [5, 50],
    [15, 75],
    [55, 100],
    [75, 10],
    [100, 5],
    [120, 50]
  ]

  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 30
  }

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dummyData.map(d => d[0])) as any)
    .range([margin.left, width - margin.right])
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dummyData.map(d => d[1])) as any)
    .range([height - margin.bottom, margin.top])
  const line = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))

  const d = line(dummyData)!
  return <>
    <svg className="bg-gray-50" viewBox={`0 0 ${width} ${height}`}>
      <motion.path d={d}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        fill="none" stroke='currentColor' />
      {/* y的坐标 */}
      {yScale.ticks(5).map(max => {
        return <g key={max} className="text-gray-400" transform={`translate(0,${yScale(max)})`} >
          <line
            x1={margin.left}
            x2={width - margin.right}
            strokeDasharray={5}
            stroke="currentColor"
          />
          <text className="text-[10px]"
            alignmentBaseline="middle"
            fill='currentColoor'>{max}</text>
        </g>
      })}
      {/* x的坐标 */}
      {xScale.ticks(5).map((date, i) => {
        return <g key={date} transform={`translate(${xScale(date)}, 0)`}>
          {i % 2 == 1 && <rect width={50}
            height={height - margin.bottom}
            fill="black" />}
          <text y={height} className='text=[10px]'
            textAnchor='middle'
          >{date}</text>
        </g>
      })}

      {dummyData.map((d, i) => {
        return <motion.circle
          initial={{ cy: margin.bottom - height }}
          animate={{ cy: yScale(d[1]) }}
          transition={{ duration: 0.5, delay: 0.1 * i }}
          key={i}
          r={5}
          cx={xScale(d[0])}
          cy={yScale(d[1])}
          fill="currentColor"
          stroke='white'
          strokeWidth="2"
        />
      })}
    </svg>
  </>
}