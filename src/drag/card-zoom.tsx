import React, { useEffect } from 'react'

import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react'
import { animated, useSpring } from 'react-spring'
import styled from 'styled-components'
const useGesture = createUseGesture([dragAction, pinchAction])

/**
 * sandbox上的demo
 * https://codesandbox.io/examples/package/@use-gesture/react
 * 
 * 
 * 官方的照片缩放
 * https://codesandbox.io/s/github/pmndrs/use-gesture/tree/main/demo/src/sandboxes/card-zoom?file=/src/App.jsx
 * @returns 
 */
export default function CardZoom() {
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault()
    document.addEventListener('gesturestart', handler)
    document.addEventListener('gesturechange', handler)
    document.addEventListener('gestureend', handler)
    return () => {
      document.removeEventListener('gesturestart', handler)
      document.removeEventListener('gesturechange', handler)
      document.removeEventListener('gestureend', handler)
    }
  }, [])

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }))

  const ref = React.useRef<HTMLDivElement>(null)


  useGesture({
    onDrag({ pinching, cancel, offset: [x, y], ...reset }) {
      if (pinching) {
        return cancel()
      }
      api.start({ x, y })
    },
    onPinch({ origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) {
      if (first) {
        const { width, height, x, y } = ref.current!.getBoundingClientRect()
        const tx = ox - (x + width / 2)
        const ty = oy - (y + height / 2)
        memo = [style.x.get(), style.y.get(), tx, ty]
      }
      const x = memo[0] - (ms - 1) * memo[2]
      const y = memo[1] - (ms - 1) * memo[3]

      api.start({ scale: s, rotateZ: a, x, y })
      return memo
    }
  }, {
    target: ref,
    drag: {
      from() {
        return [style.x.get(), style.y.get()]
      }
    },
    pinch: {
      scaleBounds: {
        min: 0.5,
        max: 2,
      },
      rubberband: true
    }
  })

  return (
    <Wrapper>
      <animated.div className="card" ref={ref} style={style}></animated.div>
    </Wrapper>
  )
}


const Wrapper = styled.div`
  background: indianred;
  display:flex;
  align-items:center;
  justify-content:center;
  >.card{
    position: relative;
    width: 300px;
    height: 300px;
    background: url(https://images.pexels.com/photos/1030963/pexels-photo-1030963.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500);
    background-size: cover;
    border-radius: 5px;
    box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.3);
    will-change: transform;
    border: 10px solid white;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 22px;
    padding: 20px;
    text-align: center;
    color: #ffffffaa;
  }
`