import React, { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { HTMLMotionProps, motion } from 'framer-motion'
/**
 * 延迟使得子组件不执行动画
 */
export const FEndContext = createContext(true)
export function FirstNoAnimateContext({
  children
}: {
  children: React.ReactNode
}) {
  const parentAnimationFinished = useContext(FEndContext)
  const [allowAnimated, setAllowAnimated] = useState(false)
  useEffect(() => {
    setAllowAnimated(true)
  }, [])
  return <FEndContext.Provider value={parentAnimationFinished && allowAnimated}>{children}</FEndContext.Provider>
}

export type MDivProps = Omit<HTMLMotionProps<"div">, "isFinished" | "thisRef" | "children"> & {
  children?: React.ReactNode
  thisRef?: React.Ref<HTMLDivElement>
}
export default function MDiv({
  thisRef,
  ...props
}: MDivProps) {
  return <MBaseDiv {...props} {...LayoutMotion} thisRef={thisRef} isFinished={e => e == 'show'} />
}
type HTMLTag = keyof React.ReactHTML
export function MBaseDiv<T extends HTMLTag = 'div'>({
  asType,
  children,
  isFinished,
  thisRef,
  ...props
}: Omit<HTMLMotionProps<T>, 'children'> & {
  children?: React.ReactNode
  asType?: T
  thisRef?: React.Ref<RefE<T>>
  isFinished(v: any): boolean
}) {
  const [animationFinished, setAnimationFinished] = useState(false)
  const parentAnimationFinished = useContext(FEndContext)
  const nProps = props
  if (!parentAnimationFinished) {
    nProps.variants = undefined
    nProps.initial = undefined
    nProps.animate = undefined
    nProps.exit = undefined
  }
  const Div = useMemo(() => motion(asType || 'div'), [asType])
  return (
    <Div {...nProps}
      ref={thisRef}
      onAnimationComplete={(e: any) => {
        setAnimationFinished(isFinished(e))
        nProps.onAnimationComplete?.(e)
      }}>
      <FEndContext.Provider value={animationFinished}>
        {children}
      </FEndContext.Provider>
    </Div>
  )
}

export type RefE<T extends HTMLTag> = React.ReactHTML[T] extends React.DetailedHTMLFactory<any, infer M> ? M : never

export const LayoutMotion = {
  variants: {
    hidden: {
      height: "0px",
      scaleY: 0
    },
    show: {
      height: "auto",
      scaleY: 1
    }
  },
  transition: {
    type: "tween",
    //ease: "easeInOut"
  },
  initial: "hidden",
  animate: "show",
  exit: "hidden"
}
