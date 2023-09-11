import { MotionValue, motion, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PurePage } from "../PurePage";

export default function AnimatedCounterDemo() {
  const [count, setCount] = useState(0);
  return (
    <Wrapper>
      <p>Choose a number:</p>
      <input
        type="number"
        value={count}
        min={0}
        onChange={(e) => setCount(+e.target.value)}
      />
      <Counter value={count} />
    </Wrapper>
  )
}

const Wrapper = styled(PurePage)`
display:flex;
align-items: center;
justify-content: center;
`



function Counter({ value }: { value: number }) {
  return <div
    style={{
      fontSize
    }}
    className="flex space-x-3 rounded bg-white px-2 leading-none text-gray-900">
    <Digit place={100} value={value} />
    <Digit place={10} value={value} />
    <Digit place={1} value={value} />
  </div>
}

const fontSize = 30;
const padding = 15;
const height = fontSize + padding;

function Digit({ place, value }: {
  /**个、十、百位 */
  place: number
  /**数值 */
  value: number
}) {
  /**舍弃观察这个位置后的小数位 */
  const valueRoundedToPlace = Math.floor(value / place)
  console.log(place, valueRoundedToPlace)
  const animatedValue = useSpring(valueRoundedToPlace)
  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])

  return <div style={{ height }} className="relative w-[1ch] tabular-nums">
    {[...Array(10).keys()].map((i) => {
      return <Number key={i} mv={animatedValue} number={i} />
    })}
  </div>
}

function Number({ mv, number }: {
  mv: MotionValue
  number: number
}) {
  const y = useTransform(mv, latest => {
    //只取所观察的个位
    const placeValue = latest % 10
    const offset = (10 + number - placeValue) % 10
    let memo = offset * height
    if (offset > 5) {
      //保持上方5位,下方5位,所以减
      memo -= 10 * height
    }
    return memo
  })
  return <motion.span style={{ y }} className="absolute inset-0 flex items-center justify-center">
    {number}
  </motion.span>
}