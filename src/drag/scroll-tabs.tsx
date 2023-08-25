import React, { useRef, useState } from 'react'
import _ from "lodash";
import { useSpring } from 'react-spring';
import styled from 'styled-components';
import { useGesture } from '@use-gesture/react';
const options = _.times(100).map((i) => ({ label: `${i}`, value: i }));

/**
 * 
 * 其实没啥用
 * 不如用浏览器自带的scroll
 * 
 * https://juejin.cn/post/6957360202618241031
 * https://codesandbox.io/s/auto-scroll-tabs-4x3ql?file=/src/App.tsx
 * 
 * @returns 
 */
export default function ScrollTabs() {
  const [value, setValue] = useState(options[0].value);
  const refContainer = useRef<HTMLDivElement | null>(null);
  const [, api] = useSpring(() => ({
    from: { left: 0 },
    onChange(v) {
      refContainer.current!.scroll({ left: v.value.left });
    }
  }));

  const bind = useGesture(
    {
      onWheel() {
        api.stop(); // 取消动画，让浏览器自己处理
      },
      onDrag(h) {
        if (h.dragging) {
          // 反向的 drag movement 才是滚动的反向
          api.start({
            left: -h.movement[0],
            immediate: true // 无动画过程
          });
        } else {
          // 松手时的惯性滚动
          api.start({
            left: api.current[0].get().left - h.velocity[0] * 200
          });
        }
      }
    },
    {
      drag: {
        // 每次拖动传入 当前的 scrollLeft 作为初始状态
        from: () => [-refContainer.current!.scrollLeft, 0],
        axis: "x", // 仅在 x 方向 drag
        filterTaps: true
      }
    }
  );


  function clickItem(item: HTMLDivElement) {
    const parent = item?.offsetParent;
    if (!parent) {
      return
    }
    // 获取 item 和 容器的大小
    const itemRect = item.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // 计算 item 的中心位置
    const itemCenter = item.offsetLeft + itemRect.width / 2;

    // 计算 容器的滚动位置
    let tox = itemCenter - parentRect.width / 2;

    // 截断
    tox = _.clamp(tox, 0, parent.scrollWidth - itemRect.width);

    // 开始滚动
    api.start({
      from: { left: refContainer.current?.scrollLeft! },
      left: tox
    });
  }
  return (
    <Wrapper>
      <div {...bind()} ref={refContainer} className="body">
        <div className="content" onClick={e => {
          const item = e.target as HTMLDivElement;
          if (!item.classList.contains("item")) {
            return;
          }
          clickItem(item)
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setValue(opt.value)}
              className={[
                "item",
                opt.value === value ? "item-select" : ""
              ].join(" ")}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}


const Wrapper = styled.div`
  font-family: sans-serif;
  text-align: center;
  *{
  user-select: none;
  }
  >.body{
    width: 100%;
    position: relative;
    overflow-x: auto;
    touch-action: none;
    border-bottom: 1px solid #ccc;
    &::-webkit-scrollbar {
      display: none; /* 隐藏水平滚动条 */
    }
    >.content{
      width: max-content;
      >.item{
        position: relative;
        display: inline-block;
        width: 50px;
        height: 30px;
        margin: 0 4px 0 0;
        &::after {
          position: absolute;
          width: 100%;
          bottom: -1px;
          left: 0;
          content: "";
          border-bottom: 3px solid #37f;
          transition: all 0.3s;
          transform: scaleX(0);
        }

        &.item-select::after {
          transform: scaleX(1);
        }
      }

    }
  }
`