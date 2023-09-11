import * as d3 from "d3";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const data = [
  { name: "Mark", value: 90 },
  { name: "Robert", value: 12 },
  { name: "Emily", value: 34 },
  { name: "Marion", value: 53 },
  { name: "Nicolas", value: 98 },
  { name: "Mélanie", value: 23 },
  { name: "Gabriel", value: 18 },
  { name: "Jean", value: 104 },
  { name: "Paul", value: 2 },
]

const data2 = [
  { name: "Mark", value: 9 },
  { name: "Robert", value: 19 },
  { name: "Emily", value: 31 },
  { name: "Marion", value: 23 },
  { name: "Nicolas", value: 38 },
  { name: "Mélanie", value: 123 },
  { name: "Gabriel", value: 4 },
  { name: "Jean", value: 23 },
  { name: "Christophe", value: 22 },
]


const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;

type BarplotProps = {
  width: number;
  height: number;
  data: { name: string; value: number }[];
};


/**
 * 横向坐标
 * @param param0 
 * @returns 
 */
function Barplot({
  width,
  height,
  data
}: BarplotProps) {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  // Y axis is for groups since the barplot is horizontal
  const groups = data.sort((a, b) => b.value - a.value).map((d) => d.name);

  //枚举坐标尺
  const yScale = useMemo(() => {
    return d3.scaleBand()
      //坐标的范围
      .domain(groups)
      //图像的范围
      .range([0, boundsHeight])
      //矩形区域的间隔,[0~1)之间
      .padding(BAR_PADDING)
  }, [data, height])

  //线性坐标尺,渐变的
  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.value));
    return d3.scaleLinear()
      .domain([0, max || 10])
      .range([0, boundsWidth])
  }, [data, width])
  return <div>
    <svg width={width} height={height} transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`} >
      {xScale
        //分割线
        .ticks(5)
        //不取第一个
        .slice(1)
        .map((value, i) => {
          return <g key={i}>
            <line
              x1={xScale(value)}
              x2={xScale(value)}
              y1={0}
              y2={boundsHeight}
              stroke="#808080"
              opacity={0.2}
            />
            <text
              x={xScale(value)}
              y={boundsHeight + 10}
              textAnchor="middle"
              alignmentBaseline="central"
              fontSize={9}
              stroke="#808080"
              opacity={0.8}
            >
              {value}
            </text>
          </g>
        })}
      {data.map((d, i) => {
        const y = yScale(d.name)
        if (y) {
          return <BarItem key={d.name}
            y={y}
            x={xScale(0)}
            name={d.name}
            value={d.value}
            barHeight={yScale.bandwidth()}
            barWidth={xScale(d.value)}
          />
        }
        return undefined
      })}
    </svg>
  </div>
}


function BarItem({
  x,
  y,
  name,
  value,
  barHeight,
  barWidth
}: {
  x: number
  y: number
  name: string
  value: number
  barHeight: number
  barWidth: number
}) {
  // const y = useMotionValue(0)
  // useEffect(() => {
  //   y.set(_y)
  //   if (name == "Emily") {
  //     console.log("set-t", _y)
  //   }
  // }, [_y])
  // const halfY = useTransform(() => {
  //   if (name == "Emily") {
  //     console.log("ccc", name, y.get())
  //   }
  //   return y.get() + barHeight / 2
  // })
  const halfY = y + barHeight / 2
  return <g >
    {/* 矩形条 */}
    <motion.rect
      width={barWidth}
      height={barHeight}
      opacity={0.7}
      stroke="#9d174d"
      fill="#9d174d"
      fillOpacity={0.3}
      strokeWidth={1}
      rx={1}
      animate={{
        x, y
      }}
    />
    {/* 数值说明 */}
    <motion.text
      textAnchor="end"
      alignmentBaseline="central"
      fontSize={12}
      opacity={barWidth > 90 ? 1 : 0}
      animate={{

        x: barWidth - 7,
        y: halfY
      }}
    >{value}</motion.text>

    <motion.text
      textAnchor="start"
      alignmentBaseline="central"
      fontSize={12}
      animate={{
        x: x + 7,
        y: halfY
      }}
    >
      {name}</motion.text>
  </g>
}

const buttonStyle = {
  border: "1px solid #9a6fb0",
  borderRadius: "3px",
  padding: "4px 8px",
  margin: "10px 2px",
  fontSize: 14,
  color: "#9a6fb0",
  opacity: 0.7,
};
const BUTTONS_HEIGHT = 50;
export default function demo() {
  const [selectedData, setSelectedData] = useState(data);
  return (<div>
    <div style={{ height: BUTTONS_HEIGHT }}>
      <button style={buttonStyle} onClick={() => setSelectedData(data)}>
        Data 1
      </button>
      <button style={buttonStyle} onClick={() => setSelectedData(data2)}>
        Data 2
      </button>
    </div>
    <Barplot data={selectedData} width={400} height={400} />
  </div>
  )
}