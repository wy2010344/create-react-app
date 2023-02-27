import { useDrag } from '@use-gesture/react'
import { motion, clamp } from 'framer-motion'
import React, { useRef, useState } from 'react'
import { useSprings, animated } from 'react-spring'
import styled from 'styled-components'


const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/4016596/pexels-photo-4016596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]
export default function Viewpaper() {
  return <MotionViewPaper />
}
function SpringViewPaper() {
  const index = useRef(0)
  const width = window.innerWidth

  const [props, api] = useSprings(pages.length, i => ({
    x: i * width,
    scale: 1,
    display: 'block',
  }))
  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > width / 2) {
      index.current = clamp(0, pages.length - 1, index.current + (xDir > 0 ? -1 : 1))
      cancel()
    }
    api.start(i => {
      if (i < index.current - 1 || i > index.current + 1) {
        return {
          display: 'none'
        }
      }
      const x = (i - index.current) * width + (active ? mx : 0)
      const scale = active ? 1 - Math.abs(mx) / width / 2 : 1
      return {
        x,
        scale,
        display: 'block'
      }
    })
  })
  return (
    <ViewPaperWrapper>
      {props.map(({ x, display, scale }, i) => {
        const attrs = bind()
        return <animated.div className="page" {...attrs} key={i} style={{ display, x }}>
          <animated.div style={{ scale, backgroundImage: `url(${pages[i]})` }} />
        </animated.div>
      })}
    </ViewPaperWrapper>
  )
}


function MotionViewPaper() {
  const [index, setIndex] = useState(0)

  const [dragState, setDragState] = useState<{
    active: boolean
    x: number
    xDir: number
  }>()
  const width = window.innerWidth
  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > width / 2) {
      setIndex(clamp(0, pages.length - 1, index + (xDir > 0 ? -1 : 1)))
      cancel()
    }
    setDragState({
      active,
      x: mx,
      xDir
    })
  })
  return <ViewPaperWrapper>
    {pages.map((page, i) => {
      const attrs = bind()
      return <motion.div className="page" {...(attrs as any)}
        animate={i < index - 1 || i > index + 1 ? {
          display: 'none'
        } : {
          display: 'block',
          x: (i - index) * width + (dragState?.active ? dragState.x : 0)
        }}
        key={i} >
        <motion.div
          animate={{
            scale: dragState?.active ? 1 - Math.abs(dragState?.x) / width / 2 : 1
          }}
          style={{ backgroundImage: `url(${page})` }} />
      </motion.div>
    })}
  </ViewPaperWrapper>
}

const ViewPaperWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  >.page{
    position: absolute;
    width: 100%;
    height: 100%;
    touch-action: none;
    >div{
      touch-action: none;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      width: 100%;
      height: 100%;
      box-shadow: 0 62.5px 125px -25px rgba(50, 50, 73, 0.5), 0 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
    }
  }
`
