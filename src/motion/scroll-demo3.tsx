import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import styled from "styled-components";
import HookRender from "../HookRender";

/**
 * @todo 并没有很好地完成工作
 * @returns 
 */
export default function ScrollDemo3() {
  const cardViewRef = useRef(null)
  return <ScrollDemo3Wrapper ref={cardViewRef}>
    {Array(10).fill(1).map((_, id) => (
      <HookRender key={id} render={() => {
        const ref = useRef(null)
        const { scrollYProgress } = useScroll({
          //不能指定container
          //container: cardViewRef,
          target: ref,
          offset: ["end end", "start start"]
        });
        return <section>
          <div className="container" ref={ref} >
            <figure className="progress">
              <svg id="progress" width="75" height="75" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="30"
                  pathLength="1"
                  className="indicator"
                  style={{ pathLength: scrollYProgress }}
                />
              </svg>
            </figure>
          </div>
          <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
        </section>
      }} />
    ))}
  </ScrollDemo3Wrapper>
}

const ScrollDemo3Wrapper = styled.div`
  border:1px solid gray;
  /* width: 375px;
  height: 667px; */
  width:100%;
  //height:100%;
  overflow: auto;
  position:relative;
  >section {
    height: 667px;
    >.container{
      width: 100px;
      height: 200px;
      border: 2px dotted red;
      position: relative;
      >.progress{
        position: sticky;
        top: 0;
        width: 80px;
        height: 80px;
        margin: 0;
        padding: 0;

        >svg{
          //transform: translateX(-100px) rotate(-90deg);
          >circle{
            stroke-dashoffset: 0;
            stroke-width: 5%;
            fill: none;
          }
          >.bg {
            stroke: green;
            opacity: 0.2;
          }
          >.indicator{
            stroke:red;
          }
        }
      } 
    }
    >.progress {
      height: 5px;
      background: green;
    }
  }
  >.progress {
    position: sticky;
    left: 0;
    right: 0;
    height: 5px;
    background: green;
    bottom: 100px;
  }
`
