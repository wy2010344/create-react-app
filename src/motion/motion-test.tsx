import { motion, useDragControls, useMotionValue, useMotionValueEvent } from 'framer-motion'
import React, { useState } from 'react'
import styled from 'styled-components'

export default function motionTest() {
  const [onHover, setOnHover] = useState(false)
  return (
    <Wrapper>motion-


      <button className="normal"
        //  onMouseEnter={() => {
        //   setOnHover(true)
        // }} onMouseLeave={() => {
        //   setOnHover(false)
        // }}
        onTouchStart={() => {
          setOnHover(true)
        }}
        onTouchEnd={() => {
          setOnHover(false)
        }}
      >
        这是一个测试
      </button>

      <motion.button
        className="box"
        //whileHover={{ scale: 1.2, backgroundColor: "red" }}
        whileTap={{ scale: 0.9, backgroundColor: "green" }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onHoverStart={() => {
          setOnHover(true)
        }}
        onHoverEnd={() => {
          setOnHover(false)
        }}
      >motion-button{onHover ? 'hover' : 'not-hovered'}</motion.button>
      <MoveTest />
      <DragChangeX />
    </Wrapper>
  )
}

/**
 * 伪类顺序 :link :visited :hover :active
 * LVHA
 * :hover只支持桌面,在移动端显示不佳
 * :active支持移动端显示效果
 */
const Wrapper = styled.div`
  >.normal{
    width:100px;
    height:100px;
    transition: transform 0.2s;
    &:active {
      background-color:green;
      transform: scale(0.3);
    }
    &:hover{
      background-color:red;
    }
  }

`


function MoveTest() {

  /**
   * 绑定到元素上,是跟随的
   */
  const x = useMotionValue(0)
  const [step, setStep] = useState(0)

  useMotionValueEvent(x, "change", function (e) {
    console.log("change", e)
  })
  useMotionValueEvent(x, "animationStart", function () {
    console.log("animationStart")
  })
  useMotionValueEvent(x, "animationCancel", function () {
    console.log("animationCancel")
  })
  useMotionValueEvent(x, "animationComplete", function () {
    console.log("animationComplete")
  })
  useMotionValueEvent(x, "velocityChange", function (e) {
    console.log("velocityChange", e)
  })
  useMotionValueEvent(x, "renderRequest", function () {
    console.log("renderRequest")
  })
  return <Wrapper2>
    <motion.button
      animate={{
        x: step * 200
      }}
      className='button'
      style={{
        x
      }}
      drag="x"
    // onClick={() => {
    //   setStep(v => v + 1)
    // }}
    >点击移动</motion.button>
  </Wrapper2>
}

const Wrapper2 = styled.div`
  
  height:300px;
  >.button{
    background:green;
  }
`

function DragChangeX() {
  const x = useMotionValue(0)

  useMotionValueEvent(x, "change", e => {
    console.log("change", e)
    if (e > 100) {
      x.jump(10)
    }
  })
  const dragControl = useDragControls()
  return <Wrapper3>
    <motion.div className='rect'
      style={{
        x
      }}
      dragControls={dragControl}
      drag="x">

    </motion.div>
    <div className='circle' onPointerDown={e => {
      dragControl.start(e, {
        //  snapToCursor: true
      })
    }}>

    </div>
  </Wrapper3>
}

const Wrapper3 = styled.div`
  
height:300px;

>.rect{
  height:100px;
  width:100px;
  background:blue;
}
>.circle{
  height:30px;
  width:30px;
  background:red;
}
`