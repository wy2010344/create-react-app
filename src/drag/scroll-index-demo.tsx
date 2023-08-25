import { useWheel } from '@use-gesture/react'
import React, { memo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Lethargy } from 'lethargy'

const slides = [0, 1, 2, 3, 4, 5]
/**夹断,即如果在范围中,取范围中.否则最最大值或最小值*/
const clamp = (value: number, min: number, max: number) => Math.max(Math.min(max, value), min)

const lethargy = new Lethargy()
/**
 * 官方 https://codesandbox.io/s/lethargy-2coe8?file=/src/styles.css:398-607
 * @returns 
 */
export default function scrollIndex() {
  const [scrolling, setScrolling] = useState('rested')
  const [index, setIndex] = useState(0)

  const bind = useWheel(({ event, last, memo: wait = false }) => {
    if (last) {
      setScrolling('rested')
      return
    }
    const s = lethargy.check(event)
    if (s) {
      console.log("wheelDirection", s, wait)
      setScrolling(`lethary says scroll ${s < 0 ? 'down' : 'up'}`)
      if (!wait) {
        setIndex((i) => clamp(i - s, 0, slides.length - 1))
        return true
      }
    }
    return false
  })

  return (
    <Wrapper>
      <div className="app" {...bind()}>
        <div className="slider" style={{ transform: `translateY(${-index * 82.5}vh)` }}>
          {slides.map((i) => (
            <div key={i}>{i}</div>
          ))}
        </div>
        <footer>Scrolling: {scrolling}</footer>
      </div>
    </Wrapper>
  )
}


const Wrapper = styled.div`

position: relative;
width: 100%;
height:300vh;
>.app{
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  padding-top: 7.5vh;
  >.slider{
    transition: transform 350ms ease-in-out;
    >div{
      font-size: 20vw;
      color: white;
      min-height: 80vh;
      width: 80vw;
      background-color: royalblue;
      margin: 2.5vh 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
}

footer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  padding: 4px;
  text-align: center;
  background: black;
  color: white;
}
`