import * as d3 from "d3";
import { useMemo, useRef } from "react";
const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type StackedAreaChartProps = {
  width: number;
  height: number;
  data: { [key: string]: number }[];
};

/**
 * 这也是一累加形式,让人误以为是层叠
 * @param param0 
 * @returns 
 */
export const StackedAreaChart = ({
  width,
  height,
  data,
}: StackedAreaChartProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  // Data Wrangling: stack the data
  const stackSeries = d3
    .stack()
    .keys(["groupA", "groupB", "groupC", "groupD"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
  const series = stackSeries(data);


  // Y axis
  const max = 300; // todo
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [data, height]);


  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.x);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([xMin || 0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width]);
  const axesRef = useRef(null);

  // Build the line
  const areaBuilder = d3
    .area<any>()
    .x((d) => {
      return xScale(d.data.x);
    })
    .y1((d) => yScale(d[1]))
    .y0((d) => yScale(d[0]));

  return <svg width={width} height={height}>
    <g
      width={boundsWidth}
      height={boundsHeight}
      transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
    >
      {series.map((serie, i) => {
        const path = areaBuilder(serie)
        return <path
          key={i}
          d={path || ''}
          opacity={1}
          stroke="none"
          fill="#9a6fb0"
          fillOpacity={i / 10 + 0.1}
        />
      })}
    </g>
    <g
      width={boundsWidth}
      height={boundsHeight}
      ref={axesRef}
      transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
    />
  </svg>

}
export default function StackAreaChartDemo() {
  return (
    <div>
      <StackedAreaChart width={700} height={400} data={data} />
    </div>
  )
}


const data = [
  {
    x: 1,
    groupA: 0,
    groupB: 19,
    groupC: 9,
    groupD: 4,
  },
  {
    x: 2,
    groupA: 16,
    groupB: 0,
    groupC: 96,
    groupD: 40,
  },
  {
    x: 3,
    groupA: 64,
    groupB: 96,
    groupC: 64,
    groupD: 40,
  },
  {
    x: 4,
    groupA: 32,
    groupB: 48,
    groupC: 64,
    groupD: 40,
  },
  {
    x: 5,
    groupA: 12,
    groupB: 18,
    groupC: 14,
    groupD: 10,
  },
];