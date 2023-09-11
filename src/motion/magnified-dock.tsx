import styled from "styled-components"
import { PurePage } from "../PurePage"
import { MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"

export default function magnifiedDock() {
  const mouseX = useMotionValue(Infinity)
  return (
    <Wrapper>
      <motion.div
        onMouseMove={e => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-16 items-end gap-4 rounded-2xl bg-gray-700 px-4 pb-6"
      >
        {[...Array(8).keys()].map(i => {
          return <AppIcon key={i} mouseX={mouseX} />
        })}
      </motion.div>
    </Wrapper>
  )
}
const Wrapper = styled(PurePage)`
display: flex;
align-items: center;
`


function AppIcon({
  mouseX
}: {
  mouseX: MotionValue
}) {
  const ref = useRef<HTMLDivElement>(null)

  //光标到当前Icon中心的距离
  const distance = useTransform(mouseX, val => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })
  //在距离中心-150到150之间,宽度变化
  const widthSync = useTransform(distance, [-150, 0, 150], [40, 100, 40])
  //宽度变化,转化成一种动画
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })
  return <motion.div
    ref={ref}
    style={{ width }}
    className="aspect-square w-10 rounded-full bg-gray-400"
  />
}