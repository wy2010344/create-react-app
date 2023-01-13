import { useEffect } from "react"
import { useEvent } from "./useEvent"


export function useClickOutside(
  contains: (e: Node) => any,
  click: (e: MouseEvent) => void
) {
  const onClick = useEvent((e: MouseEvent) => {
    if (!contains(e.target as Node)) {
      click(e)
    }
  })
  useEffect(() => {
    document.addEventListener("click", onClick)
    return function () {
      document.removeEventListener("click", onClick)
    }
  }, [])
}