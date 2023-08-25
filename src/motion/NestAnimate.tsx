import { AnimatePresence, MotionProps, motion } from 'framer-motion';
import { FC, useState } from 'react';
import styled from 'styled-components';

interface NestAnimateProps {
  initial: number[]
}

/**
 * 看起来使用height比scaleY更好
 * 需要overflow:hidden
 * @returns 
 */
const NestAnimate: FC<NestAnimateProps> = ({ initial }) => {
  const [list, setList] = useState<number[]>(initial);
  const [show, setShow] = useState(true);
  return (<Wrapper>
    <AnimatePresence initial={false}>
      {show && <motion.div  {...mpro} className="area">
        <AnimatePresence initial={false}>
          {list.map(row => {
            return <motion.div key={row} {...mpro} className='sub-area'>
              <NestAnimate initial={[]} />
            </motion.div>
          })}
        </AnimatePresence>
      </motion.div>}
    </AnimatePresence>
    <button onClick={() => setList(list => list.concat(Date.now()))}>增加</button>
    <button onClick={() => setShow(show => !show)}>折叠</button>
  </Wrapper>);
}

const Wrapper = styled.div`
overflow: hidden;
>.area{
  width: 200px;
  background:linear-gradient(0deg, #57eaca, #e73838);
  /* overflow: hidden; */
  >.sub-area{
    padding: 0 30px;
    width: 100%;
    background:linear-gradient(180deg, #41f632, #4f54e1);
  }
}
`


export default NestAnimate;


const mpro: MotionProps = {
  variants: {
    show: {
      overflow: "",
      height: "",
      //scaleY: 1
    },
    hide: {
      overflow: "hidden",
      height: "0px",
      //scaleY: 0
    }
  },
  initial: "hide",
  animate: "show",
  exit: "hide",
  transition: {
    type: "tween"
  }
}