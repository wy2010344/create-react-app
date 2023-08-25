import { useGesture } from '@use-gesture/react'
import React, { useCallback, useRef } from 'react'
import { a, useSprings } from 'react-spring'
import styled from 'styled-components'

export default function InfiniteSlideshow() {
  return (
    <InfiniteSLideshowWrapper>
      <div className="main">
        <Slider items={items}>
          {({ css }, i) => (
            <SliderChild>
              <div className='marker'>{String(i).padStart(2, '0')}</div>
              <a.div className='image' style={{ backgroundImage: css }} />
            </SliderChild>
          )}
        </Slider>
      </div>
    </InfiniteSLideshowWrapper>
  )
}


const InfiniteSLideshowWrapper = styled.div`
display:flex;
align-items:center;
justify-content:center;
background: #171720;
width:100%;
height:100%;
>.main{
  height: 400px;
  width: 100%;
}
`

const SliderChild = styled.div`
width: 100%;
height: 100%;
padding: 70px 100px;
>.marker{
  color: white;
  position: absolute;
  top: 0px;
  left: 140px;
  font-family: monospace;
}
>.image{
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}
`

const styles = {
  container: { position: 'relative', height: '100%', width: '100%', touchAction: 'none' },
  item: { position: 'absolute', height: '100%', willChange: 'transform' },
} as const

/**
 * 
 * @param param0 
 * @returns 
 */
function Slider({
  items,
  width = 600,
  visible = 4,
  style,
  children
}: {
  items: any[],
  /**宽度 */
  width?: number
  visible?: number
  style?: any
  children(item: any, i: number): React.ReactNode
}) {
  /**绝对位置 */
  const idx = useCallback((x: number, l = items.length) => (x < 0 ? x + l : x) % l, [items])
  const getPos = useCallback((i: number, firstVis: number, firstVisIdx: number) => idx(i - firstVis + firstVisIdx), [idx])
  const [springs, api] = useSprings(items.length, i => ({ x: (i < items.length - 1 ? i : -1) * width }))
  const prev = useRef([0, 1])
  const target = useRef<HTMLDivElement>(null)

  /**
   * 由于是向x移动的,这里的x其实是代表x,dx代表的是方向
   * 
   * 这种无限滚动,有局部的小偏移,有整体的位置偏移
   */
  const runSprings = useCallback((x: number, dx: number) => {
    const firstVis = idx(Math.floor(x / width) % items.length)
    //如果是逆向,
    const firstVisIdx = dx < 0 ? items.length - visible - 1 : 1
    api.start(i => {
      const position = getPos(i, firstVis, firstVisIdx)
      const prevPosition = getPos(i, prev.current[0], prev.current[1])
      const rank = firstVis - (x < 0 ? items.length : 0) + position - firstVisIdx
      const configPos = dx > 0 ? position : items.length - position
      return {
        x: (-x % (width * items.length)) + width * rank,
        immediate: dx < 0 ? prevPosition > position : prevPosition < position,
        config: {
          tension: (1 + items.length - configPos) * 100,
          friction: 30 + configPos * 40
        }
      }
    })
    prev.current = [firstVis, firstVisIdx]
  }, [idx, getPos, width, visible, api, items.length])

  const wheelOffset = useRef(0)
  const dragOffset = useRef(0)

  useGesture({
    onDrag({ event, offset: [x], direction: [dx] }) {
      event.preventDefault()
      if (dx) {
        dragOffset.current = -x
        console.log("vs", wheelOffset.current)
        runSprings(wheelOffset.current + -x, -dx)
      }
    },
    onWheel({ event, offset: [, y], direction: [, dy] }) {
      event.preventDefault()
      if (dy) {
        wheelOffset.current = y
        console.log("ds", dragOffset.current)
        runSprings(dragOffset.current + y, dy)
      }
    }
  }, {
    target,
    drag: {
      eventOptions: {
        passive: false
      }
    },
    wheel: {
      eventOptions: {
        passive: false
      }
    }
  })
  return (
    <div ref={target} style={{ ...styles, ...styles.container }}>
      {springs.map(({ x }, i) => {
        return <a.div key={i} style={{ ...styles.item, width, x }} children={children(items[i], i)} />
      })}
    </div>
  )
}

export const items = [
  {
    css:
      'url(https://images.pexels.com/photos/416430/pexels-photo-416430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 150,
  },
  {
    css:
      'url(https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
  },
  {
    css:
      'url(https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
  },
  {
    css:
      'url(https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
  },
  {
    css:
      'url(https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
  },
  {
    css:
      'url(https://images.pexels.com/photos/96381/pexels-photo-96381.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
  },
  {
    css:
      'url(https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 200,
  },
  {
    css:
      'url(https://images.pexels.com/photos/227675/pexels-photo-227675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 300,
  },
  {
    css:
      'url(https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 200,
  },
  {
    css:
      'url(https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 400,
  },
  {
    css:
      'url(https://images.pexels.com/photos/911758/pexels-photo-911758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 200,
  },
  {
    css:
      'url(https://images.pexels.com/photos/249074/pexels-photo-249074.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 150,
  },
  {
    css:
      'url(https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 400,
  },
  {
    css:
      'url(https://images.pexels.com/photos/380337/pexels-photo-380337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
    height: 200,
  },
]
