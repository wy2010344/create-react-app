import React, { Suspense, useState } from 'react'

export default function index() {
  return (
    <Suspense fallback={<Fallback />}>
      <Main />
    </Suspense>
  )
}

function Fallback() {
  console.log("fallback")
  return <div>loading</div>
}

function Main() {

  const [count, setCount] = useState(0)

  const t = Date.now()
  if (t % 2) {
    throw "vv"
  }
  return <div>main
    <button onClick={() => {
      setCount(v => v + 1)
    }}>{count}</button>
  </div>
}