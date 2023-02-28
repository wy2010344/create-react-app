import { motion } from 'framer-motion'
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
