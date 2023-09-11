import { useEffect, useState } from "react"
import styled from "styled-components"

export default function index() {
  const [count, setCount] = useState(0)
  const [right, setRight] = useState(false)
  const showCdx = Math.abs(count % 3)
  useEffect(() => {
    const idx = setTimeout(() => {
      setCount(v => v + 1)
    }, 5000)
    return () => {
      clearInterval(idx)
    }
  }, [count])
  return (
    <Wrapper>
      <header>
        <div>LUNDEV</div>
        <nav>
          <ul>
            <li>HOME</li>
            <li>CONTACT</li>
            <li>INFO</li>
          </ul>
        </nav>
      </header>
      <div className={`carousel ${right ? 'right' : 'left'}`}>
        <div className="list">
          {images.map((image, i) => {
            const hideCdx = Math.abs((count + 2) % 3)
            return <div className={`item ${showCdx == i
              ? 'active'
              : ''} ${hideCdx == i ? 'hidden' : ''}`} key={image.name} style={{ "--background": image.themeColor } as any}>
              <div className="content">{image.name}</div>
              <img src={image.image} className="fruit" />
            </div>
          })}
        </div>
        <div className="leaves" style={{
          backgroundImage: `url(${leaves})`
        }}></div>
        <div className="mockup" style={{
          background: `url(${mockup}) 0 0 no-repeat, url(${listSoda}) var(--left) 0`,
          '-webkit-mask-image': `url(${mockup})`,
          backgroundSize: 'auto 100%',
          '--left': `${count * 50}%`
        } as any}></div>
        <div className="shadow"></div>
        <div className="arrow">
          <button className="prev" onClick={() => {
            setCount(c => c - 1)
            setRight(false)
          }}>{'<'}</button>
          <button className="next" onClick={() => {
            setCount(c => c + 1)
            setRight(true)
          }}>{'>'}</button>
        </div>
      </div>
    </Wrapper>
  )
}

const images = [
  {
    name: 'Strawberry',
    themeColor: '#EA3D41',
    image: require('./img/fruit_strawberry.png')
  },
  {
    name: 'avocado',
    themeColor: '#2D5643',
    image: require('./img/fruit_avocado.png')
  },
  {
    name: 'orange',
    themeColor: '#E7A043',
    image: require('./img/fruit_orange.png')
  }
]

const mockup = require('./img/mockup.png')
const listSoda = require('./img/listSoda.jpg')
const leaves = require('./img/leaves.png')
const Wrapper = styled.div`
margin: 0;
--width-mockup:calc(371px /1.5);
--height-mockup:calc(673px /1.5);
>header{
  position: absolute;
  top:0;
  display: flex;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  box-sizing: border-box;
  font-family: monospace;
  font-weight: bold;
  font-size: large;
  position: relative;
  z-index: 1;
  >nav{
    >ul{
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      gap: 20px;
    }
  }
}
>.carousel{
  width:100vw;
  height:100vh;
  position: relative;
  overflow: hidden;
  position: absolute;
  top:0;

  @keyframes toActive {
    from{
      top:100%;
      opacity: 0;
    }
  }
  @keyframes toOut {
    from{
      top:50%;
      opacity: 1;
    }
  }
  @keyframes toActivePrev {
    from{
      top:0;
      opacity: 0;
    }
  }
  >.list{
    width: 100%;
    height: 100%;
    >.item{
      width: 100%;
      height: 100%;
      background-color: var(--background);
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      display: none;
      >img.fruit{
        width: 90%;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        z-index: 15;
        pointer-events: none;
      }

      >.content{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-size: 12rem;
        color:#eee;
        font-weight: bold;
        font-family: system-ui;
        text-transform: uppercase;
        white-space: nowrap;
      }

      @media screen and (max-width: 768px) {
          >.content{
              transform: translate(-50%, -50%) scale(.5);
          }
        >img.fruit{
              width: 100%;
              height: 100%;
              object-fit: cover;
          }
      }
      &.hidden{
        display: block;
        pointer-events: none;
        background-color: transparent;
        z-index: 1;
        >img.fruit{
          animation: toOut 0.8s ease-in-out 1;
          opacity: 0;
        }
        >.content{
          opacity: 0;
        }
      }
    }
  }
  >.arrow{
    > * {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: transparent;
      border: 1px solid #eee9;
      background-color: #eee5;
      color: #eee;
      font-size: x-large;
      font-family: monospace;
      cursor: pointer;
      z-index: 15;

      &.prev{
        left:20px;
      }
      &.next{
        right:20px;
      }
    }
  }

  >.mockup{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: var(--height-mockup);
    width: var(--width-mockup);
    background-size: auto 100%;
    background-blend-mode: multiply;
    transition: background 0.5s;

    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: auto 100%;
  }
  >.leaves{
    position: absolute;
    width: 170px;
    height: 170px;
    background-size: 100%;
    top: calc((50% - (var(--height-mockup) / 1.7)));
    left: calc((50% + (var(--width-mockup) / 5)));
  }
  >.shadow{
    width: var(--width-mockup);
    height: 100px;
    background-color: #0008;
    border-radius: 50%;
    position: absolute;
    top:  calc((50% + (var(--height-mockup) / 2)));
    left: 50%;
    transform: translateX(-50%);
    filter: blur(20px);
  }

  &.right{
    >.list{
      >.item{
        &.active{
          display: block;
          >img.fruit{
            animation: toActive 0.5s ease-in-out 1;
          }
          >.content{
            animation:toActive 0.8s ease-in-out 1;
          }
        }
        &.hidden{
          >img.fruit{
            top: -100%;
          }
        }
      }
    }
  }

  &.left{
    >.list{
      >.item{
        &.active{
          display: block;
          >img.fruit{
            animation: toActivePrev 0.5s ease-in-out 1;
          }
          >.content{
            animation:toActivePrev 0.8s ease-in-out 1;
          }
        }
        &.hidden{
          >img.fruit{
            top:100%;
          }
        }
      }
    }
  }
}
`