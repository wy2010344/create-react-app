import { useSpring, distance2D, motion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import React, { useState } from 'react'
import styled from 'styled-components'
import HookRender from '../HookRender';
const grid = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]];
const size = 60;
const gap = 10;
export default function demo() {
  const [active, setActive] = useState({ row: 0, col: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <Wrapper>
      <motion.div
        animate={{ "--base-hue": 360 } as any}
        initial={{ "--base-hue": 0 } as any}
        transition={{ duration: 10, loop: Infinity, ease: "linear" }}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <motion.div style={{
          display: "flex",
          width: (size + gap) * 4 - gap,
          height: (size + gap) * 4 - gap,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          position: "relative",
          perspective: 500
        }}>
          {grid.map((row, rowIndex) => row.map((cell, colIndex) => <HookRender key={`${colIndex}--${rowIndex}`} render={() => {
            const isDragging = colIndex === active.col && rowIndex === active.row;
            //对角线下标?
            const diagonalIndex = (360 / 6) * (colIndex + rowIndex)

            const d = distance2D(
              {
                x: active.col,
                y: active.row
              },
              {
                x: colIndex,
                y: rowIndex
              }
            )

            const springConfig = {
              stiffness: Math.max(700 - d * 120, 0),
              damping: 20 + d * 5
            }
            const dx = useSpring(x, springConfig)
            const dy = useSpring(y, springConfig)

            useMotionValueEvent(dy, "change", e => {
              console.log("change", e)
            })
            //并不会触发它
            useMotionValueEvent(dy, "animationStart", () => {
              console.log("animate")
            })
            return <motion.div
              drag
              //不移动
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
              //全弹性
              dragElastic={1}
              onDragStart={() => setActive({
                row: rowIndex,
                col: colIndex
              })}
              style={{
                background: `hsla(calc(var(--base-hue) + ${diagonalIndex}), 80%, 60%, 1)`,
                width: size,
                height: size,
                top: rowIndex * (size + gap),
                left: colIndex * (size + gap),
                position: "absolute",
                borderRadius: "50%",
                x: isDragging ? x : dx,
                y: isDragging ? y : dy,
                zIndex: isDragging ? 1 : 0
              }}
            >

            </motion.div>
          }} />))}
        </motion.div>
      </motion.div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  font-family: sans-serif;
  text-align: center;
  width: 100vw;
  height: 100vh;
  display: flex;
  place-content: center;
  place-items: center;
  margin: 0;
  padding: 0;
  perspective: 1000px;
  overflow: hidden;
`