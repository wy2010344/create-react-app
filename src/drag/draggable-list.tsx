import React, { useRef, useState } from 'react'
import { useSprings, config, animated } from 'react-spring'
import { useDrag } from '@use-gesture/react'
import { Animated } from '@react-spring/animated'
import styled from 'styled-components'
const items = 'Lorem ipsum dolor sit'.split(' ')

const backgrounds = [
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
  'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)'
]
function fn(order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) {
  return function (index: number) {
    if (active && index == originalIndex) {
      //调整的项
      return {
        y: curIndex * 100 + y,
        scale: 1.1,
        zIndex: 1,
        shadow: 15,
        immediate(key: string) {
          return key == 'zIndex'
        },
        config(key: string) {
          return key == 'y' ? config.stiff : config.default
        }
      }
    } else {
      //其它项
      return {
        y: order.indexOf(index) * 100,
        scale: 1,
        zIndex: 0,
        shadow: 1,
        immediate: false
      }
    }
  }
}
export default function DraggableList() {
  const [order, setOrder] = useState(items.map((_, index) => index))
  const [springs, api] = useSprings(items.length, fn(order))

  const bind = useDrag(({ args: [originalIndex], active, movement: [_, y] }) => {
    //当前位置
    const curIndex = order.indexOf(originalIndex)
    //移动到的位置
    const curRow = clamp(Math.round(curIndex + y / 100), 0, items.length - 1)
    const newOrder = swap(order, curIndex, curRow)
    api.start(fn(newOrder, active, originalIndex, curIndex, y))
    if (!active) {
      console.log("setOrder", newOrder)
      setOrder(newOrder)
    }
  })
  return (
    <div className='w-full flex items-center justify-center relative'>
      <Div className="div">
        {springs.map(({ zIndex, shadow, y, scale }, i) => (
          <animated.div
            {...bind(i)}
            key={i}
            style={{
              zIndex,
              boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
              y,
              scale,
              background: backgrounds[i]
            }}
            children={items[i] + 'dd' + i}
          />
        ))}
      </Div>
    </div>
  )
}

const Div = styled.div`
  height:400px;
  width: 320px;
  >div{
    position: absolute;
    width: 320px;
    height: 80px;
    transform-origin: 50% 50% 0px;
    border-radius: 5px;
    color: white;
    line-height: 40px;
    padding-left: 32px;
    font-size: 14.5px;
    background: lightblue;
    text-transform: uppercase;
    letter-spacing: 2px;
    touch-action: none;
  }
`


function clamp(n: number, min: number, max: number) {
  if (n < min) {
    return min
  }
  if (n > max) {
    return max
  }
  return n
}

function swap<T>(list: T[], fromIndex: number, newIndex: number) {
  const newList = list.slice()
  const [row] = newList.splice(fromIndex, 1)
  newList.splice(newIndex, 0, row)
  return newList
}