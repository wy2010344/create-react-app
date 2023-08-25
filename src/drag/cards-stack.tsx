import { useDrag } from '@use-gesture/react'
import React, { useState } from 'react'
import { useSprings, animated, to as interpolate } from 'react-spring'
import styled from 'styled-components'



/*
const bind = useXXXX(state => {
  const {
    event , // 源事件         
    xy , // [x,y] 值（指针位置或滚动偏移）            
    initial , // 手势开始时的 xy 值       
    intentional, //是有意的手势   
    delta , // 运动增量（运动 - 前一个运动）         
    offset , // 自第一个手势后的偏移量        
    lastOffset , // 最后一个手势开始时的偏移量    
    motion , // offset 和 lastOffset 之间的    位移      
    velocity , // 每个轴的手势动量（以 px/ms 为单位）      
    distance , // 每轴偏移距离      
    direction , // 每轴方向     
    startTime , // 手势开始时间     
    elapsedTime , // 手势经过时间   
    type , // 事件类型          
    target , // 事件目标        
    currentTarget , // 事件 currentTarget 
    timeStamp , // 事件的时间戳  

    first , // 当它是第一个事件时为真         
    last , // 当它是最后一个事件时为真          
    active , // 当手势激活时为真        
    memo , // 处理程序在上一次运行时返回的值          
    cancel , // 你可以调用来中断一些手势的函数
            
    cancelled , // 手势是否被取消（拖动和捏合）      
    down , // 当鼠标按钮或触摸按下时为真          
    button , // 按下的按钮数       
    touches , // 触摸屏幕的手指数       
    args , // 传递给 bind 的参数（仅限 React）          
    ctrlKey , // 当控制键被按下时为真       
    altKey , // " " alt " "        
    shiftKey , // " " 移位 " "      
    metaKey , // " " 元 " "       
    locked , // 是否设置了 document.pointerLockElement        
    dragging , // 是当前被拖动的组件 
    moving,        // "              "              "  moved
    scrolling,     // "              "              "  scrolled
    wheeling,      // "              "              "  wheeled
    pinching       // "              "              "  pinched
  } = state
})
*/

const cards = [
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
]

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
})
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

export default function CardsStack() {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  })) // Create a bunch of springs using the helpers above


  const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    const trigger = vx > 0.2
    if (!active && trigger) {
      gone.add(index)
    }
    api.start(i => {
      if (index != i) {
        return
      }
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0
      const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0)
      const scale = active ? 1.1 : 1
      return {
        x,
        rot,
        scale,
        config: {
          friction: 50,
          tension: active ? 800 : isGone ? 200 : 500
        }
      }
    })
    if (!active && gone.size == cards.length) {
      setTimeout(() => {
        gone.clear()
        api.start(i => to(i))
      })
    }
  })
  return (
    <Wrapper>
      {props.map(({ x, y, rot, scale }, i) => {
        return <animated.div className="deck" key={i} style={{ x, y }}>
          <animated.div {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i]})`
            }}
          />
        </animated.div>
      })}
    </Wrapper>
  )
}


const Wrapper = styled.div`
width:100%;
display:flex;
align-items:center;
justify-content:center;
background: lightblue;
cursor: url('https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/Ad1_-cursor.png') 39 39,
    auto;

>.deck{
  position: absolute;
  width: 300px;
  height: 200px;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;

  >div{
    touch-action: none;
    background-color: white;
    background-size: auto 85%;
    background-repeat: no-repeat;
    background-position: center center;
    width: 45vh;
    max-width: 300px;
    height: 85vh;
    max-height: 570px;
    will-change: transform;
    border-radius: 10px;
    box-shadow: 0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3);
  }
}
`