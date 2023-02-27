import { motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

export default function motionTest() {
  return (
    <Wrapper>motion-


      <button className="normal">
        这是一个测试
      </button>

      <motion.button
        className="box"
        whileHover={{ scale: 1.2, backgroundColor: "red" }}
        whileTap={{ scale: 0.9, backgroundColor: "green" }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >motion-button</motion.button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  >.normal{
    width:100px;
    height:100px;
    &:hover{
      background-color:red;
    }
    &:active{
      background-color:green;
    }
  }

`
