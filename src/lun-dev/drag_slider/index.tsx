import { useEffect, useReducer, useRef } from "react"
import styled from "styled-components"


function reducer(model: {
  mouseDownAt: number,
  lastMouseDownAt: number
}, action: {
  type: "down",
  e: React.MouseEvent
} | {
  type: "up"
  e: React.MouseEvent
} | {
  type: "move"
  e: React.MouseEvent
}) {
  if (action.type == 'down') {
    return {
      ...model,
      mouseDownAt: action.e.clientX,
    }
  }
  if (action.type == 'up') {
    return {
      ...model,
      mouseDownAt: 0,
      lastMouseDownAt: 0
    }
  }
  if (action.type == 'move') {
    if (model.mouseDownAt) {
      return {
        ...model,
        mouseDownAt: action.e.clientX,
        lastMouseDownAt: model.mouseDownAt
      }
    }
  }
  return model
}
export default function index() {

  const [data, dispatch] = useReducer(reducer, 0, () => {
    return {
      mouseDownAt: 0,
      lastMouseDownAt: 0
    }
  })
  const sliderRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const leftTemporary = []
  const leftLimit = 0
  useEffect(() => {
    const slider = sliderRef.current
    const form = formRef.current
    if (slider && form) {
      const leftLimit = form.offsetWidth - slider.offsetWidth / 2
      console.log('css', form.offsetWidth, slider.offsetWidth, leftLimit)
    }
  }, [])
  return (
    <Wrapper>
      <div ref={sliderRef} className={`slider ${data.mouseDownAt && 'move'}`} onMouseDown={e => {
        dispatch({
          type: "down",
          e
        })
      }} onMouseUp={e => {
        dispatch({
          type: "up",
          e
        })

      }} onMouseMove={e => {
        dispatch({
          type: "move",
          e
        })
      }}>
        <div className="title">
          Collection Photo
        </div>
        <div ref={formRef} className={`form ${data.mouseDownAt > data.lastMouseDownAt ? 'right' : data.mouseDownAt < data.lastMouseDownAt ? 'left' : ''}`}>
          {images.map(image => {
            return <div className="item" key={image.name}>
              <div className="content">
                <img src={image.src} alt="" />
                <div className="des">
                  <div>{image.name}</div>
                  <button>more</button>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </Wrapper>
  )
}


const bg = require('./img/bg.jpg')

const images = [...Array(10).keys()].map(i => {
  return {
    src: require(`./img/${i + 1}.jpg`),
    name: 'image' + i
  }
})

const Wrapper = styled.div`
margin: 0;
background-image: url(${bg});
background-size: cover;
background-position: center;
background-attachment: fixed;
min-height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
>.slider{
  width: 70vw;
  overflow: auto;
  padding: 100px;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  background-color: #fff3;
  border-radius: 20px;
  &::-webkit-scrollbar{
    width: 0;
  }
  >.title{
    padding: 20px 0;
    color: #fff;
    text-shadow: 0 0 10px #0007;
    font-weight: 500;
    font-size: large;
  }
  >.form{
    width:max-content;
    --left:160px;
    transform: translateX(var(--left));

    >.item{
      width: 200px;
      height: 300px;
      display: inline-block;
      margin-right: 20px;
      transform: perspective(10px);
      transform-style: preserve-3d;

      >img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      >.content{
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        transition: transform 0.5s;

        >.des{
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50px;
          backdrop-filter: blur(10px);
          color: #fff;
          font-family: monospace;
          display: flex;
          justify-content:space-between;
          align-items: center;
          padding: 10px;
          box-sizing: border-box;

          >button{
            background-color: #eee;
            border: none;
            border-radius: 10px;
            font-size: small;
          }
        }
      }
    }

    &.left{
      >.item{
        >.content{
    transform: rotateY(-1deg) scale(0.8);
        }
      }
    }
    &.right{
      >.item{
        >.content{
    transform: rotateY(1deg) scale(0.8);
        }
      }
    }
  }
  &.move{
    user-select: none;
    cursor: grab;
    >.form{
      pointer-events: none;
    }
  }
}
`