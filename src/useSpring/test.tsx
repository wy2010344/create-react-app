import React, { useState } from 'react'
import styled from 'styled-components'
import { animated, useSpring } from '@react-spring/web'

export default function test() {
  const [open, setOpen] = useState(false)
  return (
    <Wrapper>
      {open && <Test2 />}

      <button onClick={() => {
        setOpen(!open)
      }}>开启</button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  
>.view{
  width:80px;
  height:80px;
  background:#ff6b6d;
  border-radius:8px;
}
`


function Test1() {
  const springs = useSpring({
    from: { x: 0 },
    to: { x: 100 },
  })
  return < animated.div className="view" style={{
    ...springs
  }
  } />
}

function Test2() {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }))

  const handleClick = () => {
    api.start({
      from: {
        x: 0,
      },
      to: {
        x: 100,
      },
    })
  }
  return (
    <animated.div
      onClick={handleClick}
      className="view"
      style={{ ...springs }}
    />
  )
}