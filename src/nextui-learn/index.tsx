import styled from "styled-components"
import PaginationLearn from "./PaginationLearn"

export default function index() {
  return (
    <Wrapper>
      <PaginationLearn />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  &,* {
    background-color: #fff;
    color:#000
  }
`