import { useEffect } from "react"

type DragStep = "begin" | "move" | "up"
export default function useMyDrag(ref: React.RefObject<HTMLElement>, change: (arg: {
  step: DragStep
  dx: number
  dy: number
}) => void) {
  useEffect(() => {
    let step: {
      e: MouseEvent
      step: "begin" | "move"
    } | undefined
    function pointerDown(e: MouseEvent) {
      step = {
        e,
        step: "begin"
      }
    }
    function pointerMove(e: MouseEvent) {
      if (step) {
        change({
          step: step.step,
          dx: e.pageX - step.e.pageX,
          dy: e.pageY - step.e.pageY
        })
        step = {
          e,
          step: "move"
        }
      }
    }
    function pointerUp(e: MouseEvent) {
      if (step) {
        change({
          step: "up",
          dx: e.pageX - step.e.pageX,
          dy: e.pageY - step.e.pageY
        })
        step = undefined
      }
    }
    ref.current!.addEventListener("pointerdown", pointerDown)
    document.addEventListener("pointermove", pointerMove)
    document.addEventListener("pointerleave", pointerUp)
    document.addEventListener("pointerup", pointerUp)
    return function () {
      ref.current!.removeEventListener("pointerdown", pointerDown)
      document.removeEventListener("pointermove", pointerMove)
      document.removeEventListener("pointerleave", pointerUp)
      document.addEventListener("pointerup", pointerUp)
    }
    // ref.current!.addEventListener("mousedown", pointerDown)
    // document.addEventListener("mousemove", pointerMove)
    // document.addEventListener("mouseleave", pointerUp)
    // document.addEventListener("mouseup", pointerUp)
    // return function () {
    //   ref.current!.removeEventListener("mousedown", pointerDown)
    //   document.removeEventListener("mousemove", pointerMove)
    //   document.removeEventListener("mouseleave", pointerUp)
    //   document.addEventListener("mouseup", pointerUp)
    // }
  }, [ref])

}