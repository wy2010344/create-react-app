import React from 'react'

export default function HookRender({ render }: { render(): JSX.Element }) {
  return render()
}
