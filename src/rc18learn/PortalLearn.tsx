import { createPortal } from "react-dom"
import styled from "styled-components"
import HookRender from "../HookRender"
import { useState } from "react"

/**
 * 可以增加前,意味着并未和真实dom对比
 * @returns 
 */
export default function PortalLearn() {
  return (
    <Wrapper>
      {createPortal(<HookRender render={() => {
        const [list, setlist] = useState<string[]>([])
        return <>
          {

            list.map(row => {
              return <div key={row}>
                <span>{row}</span>
                <button onClick={() => {
                  setlist(list => list.filter(x => x != row))
                }}>删除</button>
              </div>
            })
          }
          <button onClick={() => {
            setlist(list => [(Date.now() + 'xx')].concat(list))
          }}>增加前</button>
          <button onClick={() => {
            setlist(list => list.concat(Date.now() + 'xx'))
          }}>增加后</button>
        </>
      }} />, document.body)}
    </Wrapper>
  )
}

const Wrapper = styled.div`
width: 100%;
height: 100%;
background: white;
* {
  color: black;
}
`