import { useEffect, useState } from "react"
import { PurePage } from "../PurePage"
import { motion, useSpring, useTransform } from "framer-motion"
import styled from "styled-components"

export default function AnimatedNumberDemo() {
  const [value, setValue] = useState(1000)
  return (
    <Wrapper>
      <button onClick={() => setValue(value - 100)}>-100</button>

      <AnimatedNumber value={value} />

      <button onClick={() => setValue(value + 100)}>+100</button>
    </Wrapper>
  )
}
const Wrapper = styled(PurePage)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap:30px;
`

/**
 * 这里主要是利用了motion.span等的children,检测到children是MotionValue,会自动展开
 * 来源 https://buildui.com/recipes/animated-number
 * 
 * @param param0 
 * @returns 
 */
function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, {
    mass: 0.8,
    stiffness: 75,
    damping: 15
  })

  const display = useTransform(spring, current => Math.round(current).toLocaleString())

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}