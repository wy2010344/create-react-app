import * as d3 from "d3";
import { useMemo } from "react";
const data = [
  {
    x: "Jan",
    groups: {
      groupA: 12,
      groupB: 19,
      groupC: 9,
      groupD: 2,
    }
  },
  {
    x: "Feb",
    groups: {
      groupA: 16,
      groupB: 21,
      groupC: 13,
      groupD: 8,
    }
  },
  {
    x: "Mar",
    groups: {
      groupA: 23,
      groupB: 21,
      groupC: 24,
      groupD: 9,
    }
  },
  {
    x: "Apr",
    groups: {
      groupA: 38,
      groupB: 34,
      groupC: 25,
      groupD: 23,
    }
  },
  {
    x: "May",
    groups: {
      groupA: 42,
      groupB: 46,
      groupC: 34,
      groupD: 26,
    }
  },
  {
    x: "Jun",
    groups: {

      groupA: 34,
      groupB: 42,
      groupC: 32,
      groupD: 26,
    }
  },
  {
    x: "Jul",
    groups: {
      groupA: 2,
      groupB: 34,
      groupC: 21,
      groupD: 27,
    }
  },
  {
    x: "Aug",
    groups: {
      groupA: 21,
      groupB: 32,
      groupC: 16,
      groupD: 18,
    }
  },
  {
    x: "Sept",
    groups: {
      groupA: 18,
      groupB: 31,
      groupC: 18,
      groupD: 12,
    }
  },
  {
    x: "Oct",
    groups: {
      groupA: 12,
      groupB: 21,
      groupC: 14,
      groupD: 10,
    }
  },
  {
    x: "Nov",
    groups: {
      groupA: 12,
      groupB: 18,
      groupC: 14,
      groupD: 10,
    }
  },
  {
    x: "Dec",
    groups: {
      groupA: 2,
      groupB: 8,
      groupC: 4,
      groupD: 10,
    }
  },
];

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
type Group = {
  x: string;
  groups: { [key: string]: number }
}

type StackedBarplotProps = {
  width: number;
  height: number;
  data: Group[];
};

/**
 * https://www.react-graph-gallery.com/example/barplot-stacked-vertical
 * 这种同一类的多个矩形,是叠加的,并不是重叠的——让人误以为重叠
 * @param param0 
 * @returns 
 */
function StackedBarplot({
  width,
  height,
  data
}: StackedBarplotProps) {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  //月份
  const allGroups = data.map((d) => String(d.x));
  //群组---D3不科学,主组与副组在同样的列里
  const allSubgroups = d3.union(data.flatMap(v => Object.keys(v.groups)))
  const stackSeries = d3.stack().keys(allSubgroups).order(d3.stackOrderNone);
  const series = stackSeries(data.map(v => v.groups));



  const max = 200
  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0])
  }, [data, height])

  const xScale = useMemo(() => {
    return d3.scaleBand<string>()
      .domain(allGroups)
      .range([0, boundsWidth])
      .padding(0.05)
  }, [data, width])

  const colorScale = d3.scaleOrdinal<string>()
    .domain(allGroups)
    .range(["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"])

  return <svg width={width} height={height}>
    <g
      width={boundsWidth}
      height={boundsHeight}
      transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>
      {series.map((subGroups, i) => {
        return <g key={i}>
          {subGroups.map((group, j) => {
            console.log("cc", group)
            return <rect key={j}
            />
          })}
        </g>
      })}
    </g>
    <g
      width={boundsWidth}
      height={boundsHeight}
      transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>

    </g>
  </svg>
}
export default function barplotStackedVertical() {
  return (
    <div>
      <StackedBarplot data={data} width={700} height={400} />
    </div>
  )
}