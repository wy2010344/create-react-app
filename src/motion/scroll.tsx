import { motion, useScroll, useSpring } from 'framer-motion'
import React, { useRef } from 'react'
import styled from 'styled-components'
import HookRender from '../HookRender'

export default function scroll() {
  return (
    <div>
      <ScrollDemo1 />
      <ScrollDemo2 />
      <ScrollDemo5 />
    </div>
  )
}


function ScrollDemo1() {
  const hue = (h: number) => `hsl(${h}, 100%, 50%)`;
  const foods: [string, number, number][] = [
    ["🍅", 340, 10],
    ["🍊", 20, 40],
    ["🍋", 60, 90],
    ["🍐", 80, 120],
    ["🍏", 100, 140],
    ["🫐", 205, 245],
    ["🍆", 260, 290],
    ["🍇", 290, 320],
  ];
  return (
    <ScroolDemo1Wrapper>
      {foods.map(([emoji, hueA, hueB]) => {
        /**
         * 父容器触发事件,子容器绑定对应事件下的变量
         */
        return (
          <motion.div
            className="card-container"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
          >
            <div
              className="splash"
              style={{
                background: `linear-gradient(306deg,${hue(hueA)},${hue(hueB)})`,
              }}
            ></div>
            <motion.div
              className="card"
              variants={{
                offscreen: {
                  y: 300,
                },
                onscreen: {
                  y: 50,
                  rotate: -10,
                  transition: {
                    type: "spring",
                    bounce: 0.4,
                    duration: 0.8,
                  },
                },
              }}
            >
              {emoji}
            </motion.div>
          </motion.div>
        );
      })}
    </ScroolDemo1Wrapper>
  );
}
const ScroolDemo1Wrapper = styled.div`
  width: 375px;
  height: 667px;
  overflow: auto;
  > .card-container {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-top: 20px;
    margin-bottom: -120px;
    > .splash {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      clip-path: path(
        "M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z"
      );
    }
    > .card {
      font-size: 164px;
      width: 300px;
      height: 430px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 20px;
      box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075),
        0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075),
        0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075);
      transform-origin: 10% 60%;
    }
  }
`;

function ScrollDemo2() {
  const cardRef = useRef(null)
  const { scrollYProgress } = useScroll({
    container: cardRef
  });
  //scrollYProgress 是0-1
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  return <ScrollDemo2Wrapper ref={cardRef}>
    <motion.div
      className="progress-bar"
      style={{ scaleX: scaleX }}
    />
    <h1>
      <code>useScroll</code> demo
    </h1>
    <article>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac
        rhoncus quam.
      </p>
      <p>
        Fringilla quam urna. Cras turpis elit, euismod eget ligula quis,
        imperdiet sagittis justo. In viverra fermentum ex ac vestibulum.
        Aliquam eleifend nunc a luctus porta. Mauris laoreet augue ut felis
        blandit, at iaculis odio ultrices. Nulla facilisi. Vestibulum cursus
        ipsum tellus, eu tincidunt neque tincidunt a.
      </p>
      <h2>Sub-header</h2>
      <p>
        In eget sodales arcu, consectetur efficitur metus. Duis efficitur
        tincidunt odio, sit amet laoreet massa fringilla eu.
      </p>
      <p>
        Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna.
        Mauris id mauris vel arcu commodo venenatis. Aliquam eu risus arcu.
        Proin sit amet lacus mollis, semper massa ut, rutrum mi.
      </p>
      <p>Sed sem nisi, luctus consequat ligula in, congue sodales nisl.</p>
      <p>
        Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra
        leo vitae tristique rutrum. Donec ut volutpat ante, ut suscipit leo.
      </p>
      <h2>Sub-header</h2>
      <p>
        Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
        aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
        sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
        metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
        enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
        ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
        pretium.
      </p>
      <p>
        Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
        elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
        ultricies, mollis mi in, euismod dolor.
      </p>
      <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
      <p>
        Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna.
        Mauris id mauris vel arcu commodo venenatis. Aliquam eu risus arcu.
        Proin sit amet lacus mollis, semper massa ut, rutrum mi.
      </p>
      <p>Sed sem nisi, luctus consequat ligula in, congue sodales nisl.</p>
      <p>
        Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra
        leo vitae tristique rutrum. Donec ut volutpat ante, ut suscipit leo.
      </p>
      <h2>Sub-header</h2>
      <p>
        Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
        aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
        sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
        metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
        enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
        ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
        pretium.
      </p>
      <p>
        Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
        elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
        ultricies, mollis mi in, euismod dolor.
      </p>
      <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
    </article>
  </ScrollDemo2Wrapper>
}

const ScrollDemo2Wrapper = styled.div`
  width: 375px;
  height: 667px;
  overflow: auto;
  position:relative;
  >.progress-bar {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: #ff0055;
    transform-origin: 0%;
  }
`


function PageView({
  containerRef
}: {
  containerRef: React.RefObject<HTMLElement>
}) {

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
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
}


function ScrollDemo5() {
  const containerRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: containerRef });

  return <ScrollDemo5Wrapper>
    <svg id="progress" width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        pathLength="1"
        className="indicator"
        style={{ pathLength: scrollXProgress }}
      />
    </svg>
    <ul ref={containerRef}>
      {Array(10).fill(1).map((_, i) => {
        return <HookRender key={i} render={() => {
          const ref = useRef(null)
          const { scrollXProgress } = useScroll({
            container: containerRef,
            target: ref
          });

          return <li ref={ref}>
            <motion.div className="progress" style={{ scaleX: scrollXProgress }} />
          </li>
        }} />
      })}
    </ul>
  </ScrollDemo5Wrapper>
}

const ScrollDemo5Wrapper = styled.div`
  border:1px solid gray;
  width: 375px;
  height: 667px;
  overflow: auto;
  position:relative;
  #progress {
    position: absolute;
    top: 20px;
    left: 20px;
    transform: rotate(-90deg);
  }

  circle {
    stroke-dashoffset: 0;
    stroke-width: 15%;
    fill: none;
  }

  .bg {
    stroke: yellow;
    opacity: 0.3;
  }

  #progress .indicator {
    stroke: green;
  }
  >ul{
    display: flex;
    list-style: none;
    height: 300px;
    overflow-x: scroll;
    padding: 20px 0;
    flex: 0 0 600px;
    margin: 0 auto;
    li {
      flex: 0 0 200px;
      background: gray;
      margin: 0 20px 0 0;
      >.progress{
        height: 5px;
        background: green;
      }
    }

    li:last-of-type {
      margin: 0;
    }
  }
`