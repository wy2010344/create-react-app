import styled from "styled-components"

const img = 'https://thomaspark.co/wp/wp-content/uploads/2020/06/MAD-Magazine-520-Fold-in.jpg'
export default function CssFoldExample() {
  return (
    <Wrapper>
      <span className="jaffee">
        <span className="a"></span>
        <span className="bc">
          <span className="b"></span>
          <span className="c"></span>
        </span>
        <img src={img} />
      </span>
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
>.jaffee{
  --bg: url('${img}');
  position: relative;
  display: inline-flex;
  transform: rotateX(10deg); 
  transform-style: preserve-3d;
  cursor: grab;
  >img{
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 56vh;
    opacity: 0;
  }
  .a,.b,.c{
    top: 0;
    display: inline-block;
    height: 100%;
    background-image: var(--bg);
    background-size: cover;
    background-repeat: no-repeat;
  }
  >.a{
    position: absolute;
    left: 0;
    width: 50%;
    background-position: 0 0;
  }
  >.bc{
    position: absolute;
    display: inline-flex;
    width: 50%;
    height: 100%;
    left: 50%;
    transform-origin: left;
    transition: transform 3s;
    transform-style: preserve-3d;

    >.b,>.c{
      position: relative;
      width: 50%;
      backface-visibility: hidden;
    }
    >.b {
      background-position: ${200 / 3}% 0;
      transform-style: preserve-3d;
      &::after{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        transform: rotateY(180deg) translateZ(1px);
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }
    }
    >.c{
      background-position: 100% 0;
      transform-origin: left;
      transition: transform 2s;
    }
  }
  &:hover,&:active{
    >.bc{
      transform: rotateY(-180deg) translateZ(-1px);
      transition: transform 2s;
      >.c{
        transform: rotateY(180deg) translateZ(2px);
        transition: transform 3s;
      }
    }
  }
}
`