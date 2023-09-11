import styled from "styled-components"
import Barplot from "./barplot"
import LineChart from "./linechart"
import LineChartD3 from "../sam-selikoff/line-chart-d3"
import StackAreaChart from "./stacked-area-chart"

export default function index() {
  return (
    <Wrapper>
      {/* <BarplotStackedVertical /> */}
      <Barplot />
      <LineChart />
      <LineChartD3 />
      <StackAreaChart />
    </Wrapper>
  )
}

const Wrapper = styled.div`
width: 100%;
height: 100%;
overflow: auto;
background: white;
* {
  color: black;
}
`