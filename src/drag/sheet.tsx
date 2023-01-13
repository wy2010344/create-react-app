import { useDrag } from '@use-gesture/react'
import React from 'react'
import { a, config, useSpring } from 'react-spring'
import styled from 'styled-components'
const items = ['save item', 'open item', 'share item', 'delete item', 'cancel']
const height = items.length * 60 + 80

export default function Sheet() {
  const [{ y }, api] = useSpring(() => ({ y: height }))
  const open = ({
    canceled
  }: {
    canceled: boolean
  }) => {
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect
    api.start({ y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })
  }
  const close = (velocity = 0) => {
    api.start({ y: height, immediate: false, config: { ...config.stiff, velocity } })
  }

  const bind = useDrag(({ last, velocity: [, vy], direction: [, dy], movement: [, my], cancel, canceled }) => {
    if (my < -70) {
      cancel()
    }
    if (last) {
      my > height * 0.5 || (vy > 0.5 && dy > 0) ? close(vy) : open({ canceled })
    } else {
      api.start({
        y: my,
        immediate: true
      })
    }
  }, {
    from() {
      return [0, y.get()]
    },
    filterTaps: true,
    bounds: {
      top: 0
    },
    rubberband: true
  })

  const display = y.to(py => py < height ? 'block' : 'none')

  const bgStyle = {
    transform: y.to([0, height], ['translateY(-8%) scale(1.16)', 'translateY(0px) scale(1.05)']),
    opacity: y.to([0, height], [0.4, 1], 'clamp')
  }
  return (
    <SheetWrapper>
      <a.div className="bg" onClick={() => close()} style={bgStyle}>
        <img
          src="https://images.pexels.com/photos/1239387/pexels-photo-1239387.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
        />
        <img
          src="https://images.pexels.com/photos/5181179/pexels-photo-5181179.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
        />
      </a.div>
      <div className="action-btn" onClick={() => open({ canceled: false })}></div>
      <a.div className="sheet" {...bind()} style={{
        display,
        bottom: `calc(-100vh + ${height - 100}px)`,
        y
      }}>
        {items.map((entry, i) => {
          return <div
            key={entry}
            onClick={() => (i < items.length ? alert('clicked on ' + entry) : close())}
            children={entry}
          />
        })}
      </a.div>
    </SheetWrapper>
  )
}


const SheetWrapper = styled.div`
display:flex;
align-items:center;
overflow-x:hidden;
>.bg{
  width: 100%;
  >img{
    width: 100%;
    margin: 0;
    display: block;
  }
}
>.action-btn{
  position: fixed;
  z-index: 100;
  bottom: 80px;
  right: 40px;
  height: 48px;
  width: 48px;
  border-radius: 24px;
  background: coral;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 
    0px 6px 10px 0px rgba(0, 0, 0, 0.14),
    0px 1px 18px 0px rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;

  &:after{
    content: ' ';
    display: block;
    background: #fff;
    height: 20%;
    width: 20%;
    border-radius: 50%;
  }
}
>.sheet{
  z-index: 100;
  position: fixed;
  left: 2vw;
  height: calc(100vh + 100px);
  width: 96vw;
  border-radius: 12px 12px 0px;
  background: #fff;
  touch-action: none;

  >div{
    height: 60px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    text-transform: capitalize;
  }
}
`