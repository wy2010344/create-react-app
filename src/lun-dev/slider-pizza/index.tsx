import { useMemo, useState } from "react"
import styled from "styled-components"

export default function index() {
  const [count, setCount] = useState(0)
  const active = useMemo(() => {
    return Math.abs(count % images.length)
  }, [count])
  return (
    <Wrapper>
      <header>
        <ul>
          <li className="active">Home</li>
          <li>Contact</li>
          <li>Info</li>
          <li>Category</li>
        </ul>
      </header>
      <div className="slider">
        <div className="title">Slider Pizza!</div>
        <div className="images" style={{ '--rotate': `${count * 360 / images.length}deg` } as any}>
          {images.map((image, i) => {
            return <div className="item" key={i} style={{ '--i': i + 1 } as any}>
              <img src={image.image} alt="" />
            </div>
          })}
        </div>
        <div className="content">{
          images.map((image, i) => {
            return <div className={`item ${i == active ? 'active' : ''}`}>
              <h1>{image.title}</h1>
              <div className="des">{image.content}</div>
              <button>{image.detail}</button>
            </div>
          })
        }</div>

        <button className="page prev" onClick={() => {
          setCount(count => count - 1)
        }}>{'<'}</button>
        <button className="page next" onClick={() => {
          setCount(count => count + 1)
        }}>{'>'}</button>
      </div>
    </Wrapper>
  )
}

const images = [...Array(6).keys()].map(i => {
  return {
    image: require(`./${i + 1}.PNG`),
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit expedita tenetur consectetur. Ipsum, quibusdam recusandae impedit molestiae libero nobis nemo possimus perspiciatis. Debitis aliquam cum nemo aspernatur expedita ea? Et officia asperiores est aliquam? Doloribus, tenetur non? Minima vero aperiam corporis magni. Officiis, blanditiis. Iusto sint distinctio eaque non culpa.`,
    title: `PRODUCT NAME ${i + 1}`,
    detail: `See more`
  }
})

const Wrapper = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
margin: 0;
font-family: monospace;
>header{
  position: absolute;
  width: 100%;
  z-index: 100;
  border-bottom: 1px solid #fff4;
  >ul{
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    list-style: none;
    >li{
      padding: 30px 40px;
      color:#fff;

      &.active,
      &:hover{
        border-bottom: 2px slid #fff;
      }
    }
  }
}
>.slider{
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(to right,#2b2f3a,#0D0E12);
  overflow: hidden;

  &::before{
    position: absolute;
    width: 50%;
    height: 100vh;
    content: '';
    top: 0;
    left: 0;
    background-color: #E88735;
  }
  >.title{
    position: absolute;
    top: 10%;
    right: 60%;
    text-align: center;
    color:#fff;
    font-size: 150px;
    width: 40%;
    font-family: 'Pacifico',cursive;
    text-shadow: 3px 5px 0px #478860;
    line-height: 0.9em;
    transform: rotate(-5deg);
  }
  >.images{
    position: absolute;
    bottom:0%;
    left: 50%;
    transform: translate(-50%, 70%) rotate(var(--rotate));
    width: 1300px;
    height:1300px;
    border-radius: 50%;
    transition: transform 0.5s ease-in-out;
    outline: 1px dashed #fff5;
    outline-offset: -100px;
    >.item{
      position: absolute;
      width: 100%;
      height: 100%;
      text-align: center;
      rotate: calc(60deg * var(--i) + 45deg);
      >img{
        height:420px;
      }
    }
  }
  >.content{
    color: #fff;
    position: absolute;
    top: 10%;
    left: 60%;
    text-align: justify;
    width: 350px;

    @keyframes showContent{
      from{
        opacity: 0;
        transform: translateY(100px);
      }
      to{
        opacity: 1;
      }
    }
    >.item{
      display: none;

      >h1{
        color: #e88735;
        font-size:xxx-large;
      }
      >.des{
        color:#fff;
      }
      >button{
        margin-top: 30px;
        padding: 10px 30px;
        border-radius: 20px;
        background-color: #E88735;
        color:#fff;
        border:none;
        float: right;
      }
      &.active{
        display: block;
        >h1{
          opacity: 0;
          animation: showContent 0.5s ease-in-out 1 forwards;
        }
        >.des{
          opacity: 0;
          animation: showContent 0.5s 0.3s ease-in-out 1 forwards;
        }
        >button{
          opacity: 0;
          animation: showContent 0.5s 0.6s ease-in-out 1 forwards;
        }
      }
      
    }
  }
  >.page{
    position: absolute;
    border: none;
    top: 50%;
    left: 250px;
    font-size: 100px;
    font-family: cursive;
    background-color: transparent;
    color: #fff;
    font-weight: bold;
    opacity: 0.3;
    &:hover{
      opacity: 1;
    }
    &.next{
      left: unset;
      right: 250px;
    }
  }
}
`