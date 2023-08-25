import React, { useLayoutEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


/**
 * 由此测试可见,react的router,没有内置以url作为key,故仍是原始的函数类型与Key作为diff依据
 * 
 * 未来使用非嵌套路由,路由应该是动态加载进来的.
 * @param param0 
 * @returns 
 */
export default function index({
  to,
  children
}: {
  to: string,
  children?: React.ReactNode
}) {

  useLayoutEffect(() => {
    //并不是与useMemo一起执行,而是在recile后执行
    console.log("useLayoutEffect--")
  }, [])
  useMemo(() => {
    console.log("useMemo--")
  }, [])
  const [count, setCount] = useState(0)
  return (
    <div>index
      <button onClick={() => {
        setCount(v => v + 1)
      }}>--{count}--</button>
      <Link to={to}>{to}</Link>
      {children}
    </div>
  )
}
