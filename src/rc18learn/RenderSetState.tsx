import React, { useContext, useReducer } from 'react';
import { FC, ReducerState, useEffect, useMemo, useRef, useState } from 'react';

interface RenderSetStateProps { }


function useRenderCount(prefix: string) {
  const renderCount = useRef(0)
  renderCount.current++
  console.log(prefix, "重新渲染", renderCount.current)
}
const RenderSetState: FC<RenderSetStateProps> = () => {
  useRenderCount("root")
  const [count, setCount] = useState(0);

  const [c, dispatch] = useReducer(function (prev: number, data: {
    type: "add"
  }) {

    return prev
  }, 1)
  return (
    <CountContext.Provider value={{ count, setCount }}>
      <div>
        <Component1 prefix='a' />
        <Component1 prefix='b' />
        <button onClick={() => {
          setCount(count)
        }}>useState,count不改变的点击,是否更新{count}</button>
        <button onClick={() => {
          setCount(count => count)
        }}>useState,count=count不改变的点击,是否更新{count}</button>
        <button onClick={() => {
          dispatch({
            type: "add"
          })
        }}>useReducer不改变的点击,是否更新{c}</button>
      </div>
    </CountContext.Provider>);
}

function Component1({
  prefix
}: {
  prefix: string
}) {
  // useRenderCount("Component1")
  const { count: ac } = useContext(CountContext)
  const [count, setCount] = useState(0);
  useMemo(() => {
    setCount(v => v + 1)
  }, [])
  console.log(prefix, "count--", count, "ac", ac)
  useEffect(() => {
    console.log(prefix, "effect触发", count)
  }, [count])
  return <div>
    {count}
    345
    <Component2 prefix={prefix} />
  </div>
}

function Component2({
  prefix
}: {
  prefix: string
}) {
  useRenderCount(prefix + "Component2")
  // const [count, setCount] = useState(0);
  const { count, setCount } = useContext(CountContext)
  // useMemo(() => {
  //   setCount(v => v + 1)
  // }, [])
  const [c, setC] = useState(0);
  return <div>
    {c} ----{count}----
    <button onClick={() => {
      setC(v => v + 1)
      setCount(v => v + 1)
      setCount(v => v + 1)
    }}>点击</button>
  </div>
}

const CountContext = React.createContext<{
  count: number
  setCount(f: (v: number) => number): void
}>(null as any)
export default RenderSetState;
