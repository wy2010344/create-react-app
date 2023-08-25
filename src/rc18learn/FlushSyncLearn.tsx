import { useChange } from '@wangyang2010344/react-helper';
import { useState, type FC, createContext, useContext, useRef } from 'react';
import styled from 'styled-components';
import { useClickOutside } from '../useClickOutside';
import { flushSync } from 'react-dom';

interface FlushSyncLearnProps { }

const Ctx = createContext<{
  value: string
  setValue(v: string): void
  open: boolean
  setOpen(v: boolean): void
}>(null as any)

const FlushSyncLearn: FC<FlushSyncLearnProps> = () => {
  const [open, setOpen] = useChange(false)
  const [value, setValue] = useState('2345678');
  return (<Ctx.Provider value={{
    open,
    setOpen,
    value,
    setValue
  }}>
    <Wrapper {...({
      onMouseDown(event) {
        console.log("div-onMouseDown")
      },
      onMouseUp(event) {
        console.log("div-onMouseUp")
      },
      onMouseDownCapture(e) {
        console.log("div-onMouseDownCapture")

      },
      onMouseUpCapture(event) {

        console.log("div-onMouseUpCapture")
      },
      onClick(event) {
        console.log("div-onClick")
      },
      onClickCapture(event) {
        console.log("div-onClickCapture")
      },
    })}>
      {open ? <Edit /> :
        <View />}
    </Wrapper>
  </Ctx.Provider>);
}

const Wrapper = styled.div`
input{
  background-color: blue;
}
`

export default FlushSyncLearn;


function Edit() {
  const ref = useRef<HTMLInputElement>(null)
  const { value, setValue, open, setOpen } = useContext(Ctx)
  useClickOutside(e => {
    return ref.current?.contains(e)
  }, () => {
    setOpen(false)
    // flushSync(() => {
    // })
    console.log("click-out-side")
  })
  return <input ref={ref} value={value} onChange={e => setValue(e.target.value)} />
}

function View() {
  const { value, setValue, open, setOpen } = useContext(Ctx)
  return <div {...({
    onMouseDown(event) {
      console.log("onMouseDown")
    },
    onMouseUp(event) {
      console.log("onMouseUp")
    },
    onMouseDownCapture(e) {
      console.log("onMouseDownCapture")

    },
    onMouseUpCapture(event) {

      console.log("onMouseUpCapture")
    },
    onClick(e) {
      console.log("click")
      // e.stopPropagation()
    },
    onClickCapture(e) {
      console.log("onClickCapture")
      // setOpen(true)
    }
  })}>{value}</div>
}