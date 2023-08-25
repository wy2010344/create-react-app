import React, { ReducerState, useEffect, useRef, useState } from 'react'
import { useSprings, config, animated, useSpringValue } from 'react-spring'
import { useDrag } from '@use-gesture/react'
import { Animated } from '@react-spring/animated'
import styled from 'styled-components'
import { fakeData2, generateRow } from '../data/dragable-list'
import HookRender from '../HookRender'
import { hooks } from 'prismjs'
import { useEvent } from '../useEvent'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import useMyDrag from '../lib/useMyDrag'

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

/**
 * 如何做成动态添加的?
 * 
 * 先将drag变成自身的事件
 * @returns 
 */
export default function DraggableList() {
  const [items, setItems] = useState(fakeData2)
  //const [order, setOrder] = useState(items.map((_, index) => index))
  //const [springs, api] = useSprings(items.length, fn(order))
  return (
    <div className='w-full flex items-center justify-center relative'>
      <Div className="div">
        {items.map((item, i) => (
          <RenderItem key={item.text} item={item} i={i} setItems={setItems} />
        ))}
      </Div>
      <button onClick={() => {
        setItems(items => items.concat(generateRow(1, items.length)))
      }}>添加</button>
    </div>
  )
}

type RenderItemProps = {
  setItems(v: (x: any) => any): void
  item: {
    text: string
    color: string
  },
  i: number
}
function RenderItemMotion({
  item, i, setItems
}: RenderItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const moveY = useMotionValue(0)
  useMyDrag(ref, useEvent(({
    step,
    dx,
    dy
  }) => {
    let newY = 0
    if (step == "begin") {
      newY = dy
    } else if (step == "move") {
      newY = moveY.get() + dy
    }
    if (newY > 100) {
      newY = newY - 100
      setItems(items => {
        const newItems = [...items]
        const oldItem = newItems.splice(i, 1)[0]
        newItems.splice(i + 1, 0, oldItem)
        return newItems
      })
    } else if (newY < - 100) {
      newY = newY + 100
      setItems(items => {
        const newItems = [...items]
        const oldItem = newItems.splice(i, 1)[0]
        newItems.splice(i - 1, 0, oldItem)
        return newItems
      })
    }
    moveY.set(newY)
  }))

  const zIndex = useTransform(moveY, function (v) {
    if (v != 0) {
      return 12
    }
    return 0
  })
  return <motion.div
    ref={ref}
    layout
    style={{
      zIndex,
      // zIndex,
      // boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
      y: moveY,
      // scale,
      background: item.color
    }}
    children={item.text + 'dd' + i}
  />
}
function RenderItem({
  item, i, setItems
}: RenderItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const moveY = useSpringValue(0)
  useMyDrag(ref, useEvent(({
    step,
    dx,
    dy
  }) => {
    let newY = 0
    if (step == "begin") {
      newY = dy
    } else if (step == "move") {
      newY = moveY.get() + dy
    }
    if (newY > 100) {
      newY = newY - 100
      setItems(items => {
        const newItems = [...items]
        const oldItem = newItems.splice(i, 1)[0]
        newItems.splice(i + 1, 0, oldItem)
        return newItems
      })
    } else if (newY < - 100) {
      newY = newY + 100
      setItems(items => {
        const newItems = [...items]
        const oldItem = newItems.splice(i, 1)[0]
        newItems.splice(i - 1, 0, oldItem)
        return newItems
      })
    }
    moveY.set(newY)
  }))
  // useDrag(({ first, last, cancel, active, delta: [dx, dy] }) => {
  //   const i = getIndex()
  //   let newY = 0
  //   if (first) {
  //     newY = dy
  //   } else if (active) {
  //     newY = moveY.get() + dy
  //   }
  //   if (newY > 100) {
  //     newY = newY - 100
  //     setItems(items => {
  //       const newItems = [...items]
  //       const oldItem = newItems.splice(i, 1)[0]
  //       newItems.splice(i + 1, 0, oldItem)
  //       return newItems
  //     })
  //   } else if (newY < - 100) {
  //     newY = newY + 100
  //     setItems(items => {
  //       const newItems = [...items]
  //       const oldItem = newItems.splice(i, 1)[0]
  //       newItems.splice(i - 1, 0, oldItem)
  //       return newItems
  //     })
  //   }
  //   moveY.set(newY)
  // }, {
  //   target: ref
  // })

  const zIndex = moveY.to(v => {
    if (v != 0) {
      return 12
    }
    return 0
  })
  return <animated.div
    ref={ref}
    style={{
      zIndex,
      // zIndex,
      // boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
      y: moveY,
      // scale,
      background: item.color
    }}
    children={item.text + 'dd' + i}
  />
}

const Div = styled.div`
  height:400px;
  width: 320px;
  >div{
    position:relative;
    /* position: absolute; */
    width: 320px;
    height: 100px;
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


