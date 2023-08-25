import React, { ReducerState, useEffect, useRef, useState, useTransition } from 'react'
import { useSprings, config, animated, useSpringValue } from 'react-spring'
import { useDrag } from '@use-gesture/react'
import { Animated } from '@react-spring/animated'
import styled from 'styled-components'
import { fakeData2, generateRow } from '../data/dragable-list'
import HookRender from '../HookRender'
import { hooks } from 'prismjs'
import { useEvent } from '../useEvent'
import { motion, MotionValue, useMotionValue, useTransform } from 'framer-motion'
import useMyDrag from '../lib/useMyDrag'
import { flushSync } from 'react-dom'


type CurrentDrag = {
  index: number
  value: MotionValue<number>
  getY(): number
}
/**
 * 如何做成动态添加的?
 * 
 * 先将drag变成自身的事件
 * 
 * 缺点:只能在选中项内交换,鼠标没有进入,就不能交换
 * 
 * 而且这种pointer-events:none的检测,对触摸屏无效.
 * 包括touchStart与pointerEnter事件,都无效
 * @returns 
 */
export default function DraggableList() {
  const [items, setItems] = useState(fakeData2)
  const [currentDrag, setCurrentDrag] = useState<CurrentDrag>()
  //const [order, setOrder] = useState(items.map((_, index) => index))
  //const [springs, api] = useSprings(items.length, fn(order))
  return (
    <div className='w-full flex items-center justify-center relative'>
      <Div className="div">
        {items.map((item, i) => (
          <RenderItemMotion key={item.text}
            item={item} i={i}
            currentDrag={currentDrag}
            setCurrentDrag={e => {
              if (e) {
                setCurrentDrag({
                  ...e,
                  index: i
                })
              } else {
                setCurrentDrag(undefined)
              }
            }}
            onMouseEnter={() => {
              console.log("vsd")
              if (currentDrag) {
                //这个地方需要测量宽度
                // currentDrag.value.set()
                if (i != currentDrag.index) {
                  const beforeY = currentDrag.getY()
                  flushSync(() => {
                    setItems(items => {
                      const newItems = [...items]
                      const oldItem = newItems.splice(currentDrag.index, 1)[0]
                      newItems.splice(i, 0, oldItem)
                      return newItems
                    })
                    setCurrentDrag(v => {
                      if (v) {
                        return {
                          ...v,
                          index: i
                        }
                      }
                    })
                  })
                  const afterY = currentDrag.getY()
                  currentDrag.value.set(currentDrag.value.get() + beforeY - afterY)
                }
              }
            }} />
        ))}
      </Div>
      <button onClick={() => {
        setItems(items => items.concat(generateRow(1, items.length)))
      }}>添加</button>
    </div>
  )
}
function DraggableList16() {
  const [items, setItems] = useState(fakeData2)
  const [currentDrag, setCurrentDrag] = useState<CurrentDrag>()
  //const [order, setOrder] = useState(items.map((_, index) => index))
  //const [springs, api] = useSprings(items.length, fn(order))

  const [beforeY, setBeforeY] = useState<number>()
  useEffect(() => {
    if (typeof (beforeY) == 'number' && currentDrag) {
      const afterY = currentDrag.getY()
      currentDrag.value.set(currentDrag.value.get() + beforeY - afterY)
      setBeforeY(undefined)
    }
  }, [beforeY])
  return (
    <div className='w-full flex items-center justify-center relative'>
      <Div className="div">
        {items.map((item, i) => (
          <RenderItemMotion key={item.text}
            item={item} i={i}
            currentDrag={currentDrag}
            setCurrentDrag={e => {
              if (e) {
                setCurrentDrag({
                  ...e,
                  index: i
                })
              } else {
                setCurrentDrag(undefined)
              }
            }}
            onMouseEnter={() => {
              console.log("sdff")
              if (currentDrag) {
                //这个地方需要测量宽度
                // currentDrag.value.set()
                if (i != currentDrag.index) {
                  setBeforeY(currentDrag.getY())
                  setItems(items => {
                    const newItems = [...items]
                    const oldItem = newItems.splice(currentDrag.index, 1)[0]
                    newItems.splice(i, 0, oldItem)
                    return newItems
                  })
                  setCurrentDrag(v => {
                    if (v) {
                      return {
                        ...v,
                        index: i
                      }
                    }
                  })
                }
              }
            }} />
        ))}
      </Div>
      <button onClick={() => {
        setItems(items => items.concat(generateRow(1, items.length)))
      }}>添加</button>
    </div>
  )
}
type RenderItemProps = {
  currentDrag?: CurrentDrag
  item: {
    text: string
    color: string
  },
  i: number
  onMouseEnter(): void
  setCurrentDrag(v?: {
    value: MotionValue<number>
    getY(): number
  }): void
}

function RenderItemMotion({
  item, i,
  setCurrentDrag,
  onMouseEnter,
  currentDrag
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
      setCurrentDrag({
        value: moveY,
        getY() {
          return ref.current?.offsetTop || 0
        },
      })
    } else if (step == "move") {
      newY = moveY.get() + dy
    } else {
      setCurrentDrag(undefined)
    }
    // if (newY > 100) {
    //   newY = newY - 100
    //   setItems(items => {
    //     const newItems = [...items]
    //     const oldItem = newItems.splice(i, 1)[0]
    //     newItems.splice(i + 1, 0, oldItem)
    //     return newItems
    //   })
    // } else if (newY < - 100) {
    //   newY = newY + 100
    //   setItems(items => {
    //     const newItems = [...items]
    //     const oldItem = newItems.splice(i, 1)[0]
    //     newItems.splice(i - 1, 0, oldItem)
    //     return newItems
    //   })
    // }
    moveY.set(newY)
  }))

  const zIndex = useTransform(moveY, function (v) {
    if (v != 0) {
      return 12
    }
    return 0
  })
  const pointerEvents = useTransform(moveY, function (v) {
    if (v) {
      return "none"
    }
    return ""
  })
  return <motion.div
    ref={ref}
    layout={currentDrag?.index != i}
    onPointerDown={onMouseEnter}
    style={{
      zIndex,
      pointerEvents,
      // zIndex,
      // boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
      y: moveY,
      // scale,
      background: item.color
    }}
    children={item.text + 'dd' + i}
  />
}
// function RenderItem({
//   item, i, setItems
// }: RenderItemProps) {
//   const ref = useRef<HTMLDivElement>(null)
//   const moveY = useSpringValue(0)
//   useMyDrag(ref, useEvent(({
//     step,
//     dx,
//     dy
//   }) => {
//     let newY = 0
//     if (step == "begin") {
//       newY = dy
//     } else if (step == "move") {
//       newY = moveY.get() + dy
//     }
//     if (newY > 100) {
//       newY = newY - 100
//       setItems(items => {
//         const newItems = [...items]
//         const oldItem = newItems.splice(i, 1)[0]
//         newItems.splice(i + 1, 0, oldItem)
//         return newItems
//       })
//     } else if (newY < - 100) {
//       newY = newY + 100
//       setItems(items => {
//         const newItems = [...items]
//         const oldItem = newItems.splice(i, 1)[0]
//         newItems.splice(i - 1, 0, oldItem)
//         return newItems
//       })
//     }
//     moveY.set(newY)
//   }))
//   // useDrag(({ first, last, cancel, active, delta: [dx, dy] }) => {
//   //   const i = getIndex()
//   //   let newY = 0
//   //   if (first) {
//   //     newY = dy
//   //   } else if (active) {
//   //     newY = moveY.get() + dy
//   //   }
//   //   if (newY > 100) {
//   //     newY = newY - 100
//   //     setItems(items => {
//   //       const newItems = [...items]
//   //       const oldItem = newItems.splice(i, 1)[0]
//   //       newItems.splice(i + 1, 0, oldItem)
//   //       return newItems
//   //     })
//   //   } else if (newY < - 100) {
//   //     newY = newY + 100
//   //     setItems(items => {
//   //       const newItems = [...items]
//   //       const oldItem = newItems.splice(i, 1)[0]
//   //       newItems.splice(i - 1, 0, oldItem)
//   //       return newItems
//   //     })
//   //   }
//   //   moveY.set(newY)
//   // }, {
//   //   target: ref
//   // })

//   const zIndex = moveY.to(v => {
//     if (v != 0) {
//       return 12
//     }
//     return 0
//   })
//   return <animated.div
//     ref={ref}
//     style={{
//       zIndex,
//       // zIndex,
//       // boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
//       y: moveY,
//       // scale,
//       background: item.color
//     }}
//     children={item.text + 'dd' + i}
//   />
// }

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


