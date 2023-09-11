import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";



const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
type DataPoint = { x: number; y: number };
type LineChartProps = {
  width: number;
  height: number;
  data: DataPoint[];
};
export const LineChart = ({ width, height, data }: LineChartProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;


  //y方向,线性坐标尺
  const yScale = useMemo(() => {
    const [min, max] = d3.extent(data, (d) => d.y);
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      //这使得从上向下是从大到小——符合正常坐标系
      .range([boundsHeight, 0]);
  }, [data, height])

  const xScale = useMemo(() => {
    const [xMin, xMax] = d3.extent(data, (d) => d.x);
    return d3
      .scaleLinear()
      .domain([0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width])

  const axesRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove()

    //生成X轴的坐标轴
    svgElement.append("g").attr("transform", "translate(0," + boundsHeight + ")")
      .call(d3.axisBottom(xScale))
    //生成Y轴的坐标轴
    svgElement.append("g").call(d3.axisLeft(yScale))
  }, [xScale, yScale, boundsHeight])
  return <svg width={width} height={height}>
    <g
      width={boundsWidth}
      height={boundsHeight}
      transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
    >
      <path
        d={d3.line<DataPoint>().x(d => xScale(d.x)).y(d => yScale(d.y))(data) || ''}
        opacity={1}
        stroke="#9a6fb0"
        fill="none"
        strokeWidth={2}
      />
    </g>
    {/* 坐标尺子 */}
    <g
      ref={axesRef}
      width={boundsWidth}
      height={boundsHeight}
      transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
    />
  </svg>
}

export default function linechart() {
  return (
    <div>
      <LineChart width={700} height={300} data={data} />
    </div>
  )
}

const data = [
  { x: 1, y: 90 },
  { x: 2, y: 12 },
  { x: 3, y: 34 },
  { x: 4, y: 53 },
  { x: 5, y: 52 },
  { x: 6, y: 9 },
  { x: 7, y: 18 },
  { x: 8, y: 78 },
  { x: 9, y: 28 },
  { x: 10, y: 34 },
]
