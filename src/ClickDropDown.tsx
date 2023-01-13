import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import HookRender from './HookRender'
import { useClickOutside } from './useClickOutside'

export default function ClickDropDown() {
  return (
    <Wrapper>
      {Array(10).fill(1).map((_, x) => {
        return <OneRow key={x} />
      })}

    </Wrapper>
  )
}

function OneRow() {
  const [edit, setEdit] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)
  return <div className="center" >
    {edit
      ? <Edit spanRef={spanRef} cancel={() => {
        console.log("禁止")
        setEdit(false)
      }} />
      : <span ref={spanRef} className='view' key="2" onClickCapture={e => {
        console.log("启用")
        setEdit(true)
        //e.stopPropagation()
      }}>abdwc</span>}
  </div>
}
function Edit({
  cancel,
  spanRef
}: {
  cancel(): void
  spanRef: React.RefObject<HTMLSpanElement>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const clickRef = useRef(0)
  useClickOutside(e => {
    console.log("dv", e)
    return inputRef.current?.contains(e) || panelRef.current?.contains(e) //|| spanRef.current?.contains(e)
  }, function () {
    if (clickRef.current) {
      cancel()
    }
    clickRef.current = clickRef.current + 1
  })
  return <div className='edit' key="1">
    <input defaultValue="ewfw" ref={inputRef} />
    <div className='panel' ref={panelRef}>
      {Array(10).fill(1).map((_, i) => {
        return <button key={i}>{i}</button>
      })}
    </div>
  </div>
}

const Wrapper = styled.div`
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
width:100%; 
height:100%;
>.center{ 
  >.edit{
    position:relative;
    >.panel{ 
      z-index:1;
      position:absolute;
      >button{
        display:block;
      }
    } 
  }
}
`
