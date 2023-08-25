import { useVersion } from '@wangyang2010344/react-helper';
import { createContext, useContext, type FC, useLayoutEffect, useEffect } from 'react';
import styled from 'styled-components';

interface LayoutDemoProps { }

const CountCtx = createContext<{
  version: number
  updateVersion(): void
}>(null as any)
const LayoutDemo: FC<LayoutDemoProps> = () => {
  const [version, updateVersion] = useVersion()
  return (<CountCtx.Provider value={{
    version,
    updateVersion
  }}>
    <Wrapper>
      <CountX />
    </Wrapper>
  </CountCtx.Provider>);
}

const Wrapper = styled.div`
  
`

export default LayoutDemo;


function CountX() {
  const { version, updateVersion } = useContext(CountCtx)

  console.log("render--", version)
  useLayoutEffect(() => {
    if (version % 3 == 0) {
      console.log("version-layout-effect", version)
      updateVersion()
    }
    console.log("layout-effect", version)
    return () => {
      console.log("destroy-layout-effect")
    }
  })

  useEffect(() => {
    console.log("effect", version)
    return () => {
      console.log("destroy-effect")
    }
  })
  return <button onClick={() => {
    updateVersion()
  }}>
    点击{version}
  </button>
}