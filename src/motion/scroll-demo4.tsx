import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import styled from "styled-components";
import HookRender from "../HookRender";

export default function ScrollDemo4() {
  const containerRef = useRef(null)
  return <ScrollDemo4Wrapper ref={containerRef}>
    {Array(10).fill(1).map((_, i) => {
      return <HookRender key={i} render={() => {
        const ref = useRef(null);
        const { scrollYProgress } = useScroll({
          //有target时指定container,不能很好地工作
          //container: containerRef,
          target: ref,
          //
          //[end,end]目标的end遇到容器的end作为开始,是0,[start,start]目标的start到容器的start是1,默认是0
          offset: ["end end", "start start"]
          //这一个与上面一个方向相反,自下而上,默认是1,这个是系统默认
          //offset: ["start start", "end end"]
          //offset: ["start end", "end start"]
        });
        return <section>
          <div className="container" ref={ref}>
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
      // return <PageView key={i} containerRef={containerRef} />
    })}
  </ScrollDemo4Wrapper>
}


const ScrollDemo4Wrapper = styled.div`
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
      width: 200px;
      height: 300px;
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

`

