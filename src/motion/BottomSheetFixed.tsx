import { motion, MotionProps, useAnimation } from 'framer-motion'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

/**
 * 参考源 https://codesandbox.io/s/framer-motion-bottom-sheet-fixed-m2vls
 * @returns 
 */
export default function ButtonSheetFixed() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Wrapper>
      <div className="content">
        <button className="toggle" onClick={() => {
          setIsOpen(!isOpen)
        }}>Toggle</button>
        <BottomSheet isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="line"></div>
      </div>
    </Wrapper>
  )
}


const Wrapper = styled.div`
width:100%;
height:100%;
background-color: #3056fb;
>.content{
  margin-top:100px;
  display:flex;
  flex-direction:column;
  >.button{
    border:none;
    border-radius:10;
    margin:20;
    padding:5;
    max-width:200;
  }
  >.line{
    background-color:white;
    height:1px;
  }
}
`
function usePrevious<T>(value: T) {
  const previousValueRef = useRef<T>();
  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return previousValueRef.current;
}

function BottomSheet({ isOpen, setIsOpen }: {
  isOpen?: boolean
  setIsOpen(v: boolean): void
}) {
  const prevIsOpen = usePrevious(isOpen)
  const controls = useAnimation()

  useMemo(() => {
    if (prevIsOpen && !isOpen) {
      controls.start("hidden")
    } else if (!prevIsOpen && isOpen) {
      controls.start("visible")
    }
  }, [controls, isOpen, prevIsOpen])
  return (
    <Mdiv
      animate={controls}
      {...props}
      onDragEnd={(e, i) => {
        //是否应该关闭,导致结束时回到应该的位置
        const shouldClose = i.velocity.y > 20 || (i.velocity.y > 0 && i.point.y > 40)
        if (shouldClose) {
          if (isOpen) {
            setIsOpen(false)
          } else {
            //可能拖拽越界了,恢复到hidden状态
            controls.start("hidden")
          }
        } else {
          if (!isOpen) {
            setIsOpen(true)
          } else {
            //可能拖拽越界了,恢复到visible状态
            controls.start("visible")
          }
        }
        // if (shouldClose) {
        //   controls.start("hidden")

        //   setIsOpen(false)
        // } else {
        //   controls.start("visible")
        //   setIsOpen(true)
        // }
      }}
    >

    </Mdiv>
  )
}

const Mdiv = styled(motion.div)`
display:inline-block;
background-color:green;
margin-left:20px;
width:200px;
height:100px;
border-radius:10px 10px 0 0;
`
const props: MotionProps = {
  transition: {
    type: "spring",
    damping: 40,
    stiffness: 400
  },
  variants: {
    visible: {
      y: 0
    },
    hidden: {
      y: '100%'
    }
  },
  initial: "hidden",
  drag: "y",
  /**
   * 拖拽约束,超出顶部为0
   */
  dragConstraints: {
    top: 0
  },
  /**
   * 拖拽动作性约束,超出后是否允许一定的出范围的弹性
   */
  dragElastic: 0.2
}