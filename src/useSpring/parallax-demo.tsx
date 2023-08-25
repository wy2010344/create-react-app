import React from 'react'
import styled from 'styled-components'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'

const alignCenter = { display: 'flex', alignItems: 'center' }
/**
 * 来自于官方
 * 感觉缺点是固定的数量
 * @returns 
 */
export default function parallaxDemo() {
  return (
    <Wrapper>
      <div className="background"></div>
      <Parallax pages={5}>
        <ParallaxLayer offset={0} speed={0.5} style={{
          ...alignCenter,
          justifyContent: 'center'
        }}>
          <p style={{ fontSize: `1,5rem` }}>ScrollDown</p>
        </ParallaxLayer>
        <ParallaxLayer sticky={{ start: 1, end: 3 }} style={{
          ...alignCenter,
          justifyContent: "flex-start"
        }}>
          <div className={`card sticky`}>
            <p>I'm a sticky layer</p>
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={1.5} speed={1.5} style={{
          ...alignCenter,
          justifyContent: "flex-end"
        }}>
          <div className="card parallax purple">
            <p>I'm not</p>
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={2.5} speed={1.5} style={{
          ...alignCenter,
          justifyContent: "flex-end"
        }}>
          <div className="card parallax blue">
            <p>Neither am I</p>
          </div>
        </ParallaxLayer>
      </Parallax>
    </Wrapper>
  )
}


const Wrapper = styled.div`
  >.background{
    background: linear-gradient(#e66465, #9198e5);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }



.scrollText {
  font-size: 1.5rem;
}

.card {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  height: 10rem;
  width: 25%;
  text-align: center;
  border-radius: 10px;
}

.parallax {
  margin-right: 15%;
}

.sticky {
  margin-left: 15%;
  background-color: #ff6d6d;
}

.blue {
  background-color: #5b65ad;
  color: white;
}

.purple {
  background-color: #9d65d0;
}

@media (max-width: 750px) {
  .card {
    width: 40%;
  }

  .parallax {
    margin-right: 1.5rem;
  }

  .sticky {
    margin-left: 1.5rem;
  }
}
`