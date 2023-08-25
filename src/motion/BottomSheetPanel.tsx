import { AnimatePresence, MotionProps, motion, useAnimation } from 'framer-motion';
import { FC, useEffect, useReducer, useRef, useState } from 'react';
import styled from 'styled-components';

interface BottomSheetPanelProps {

}

const BottomSheetPanel: FC<BottomSheetPanelProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (<Wrapper>
    <div className="content">
      <button className="toggle" onClick={() => {
        setIsOpen(!isOpen)
      }}>Toggle</button>
    </div>
    <AnimatePresence>
      {isOpen && <BottomSheet onClose={() => setIsOpen(false)} />}
    </AnimatePresence>
  </Wrapper>);
}

const motionProps: MotionProps = {
  transition: {
    type: "spring",
    damping: 40,
    stiffness: 400
  },
  variants: {
    visible: {
      y: 0
    },
    hidden: {
      y: '100%'
    }
  },
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  drag: "y",
  /**
   * 拖拽约束,超出顶部为0
   */
  dragConstraints: {
    top: 0
  },
  /**
   * 拖拽动作性约束,超出后是否允许一定的出范围的弹性
   */
  dragElastic: 0// 0.2
}

function BottomSheet({
  onClose
}: {
  onClose(): void
}) {

  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  useEffect(() => {
    controls.start("visible")
  }, [])
  return <Mdiv ref={ref} {...motionProps}
    animate={controls}
    onDragEnd={(e, i) => {
      const div = ref.current
      if (div) {
        console.log(i.offset.y, div.offsetHeight)
        if (i.offset.y * 2 > div.offsetHeight) {
          onClose()
        } else {
          controls.start("visible")
        }
      }
    }}>

  </Mdiv>
}

const Wrapper = styled.div`
width:100%;
height:100%;
position: fixed;
>.content{
  height: 800px;
  display:flex;
  flex-direction:column;
  >.button{
    border:none;
    border-radius:10;
    margin:20;
    padding:5;
    max-width:200;
  }
  >.line{
    background-color:white;
    height:1px;
  }
}
`
const Mdiv = styled(motion.div)`
position: absolute;
bottom: 0;
left: 0;
right: 0;
background-color:green;
height:400px;
border-radius:10px 10px 0 0;
`
export default BottomSheetPanel;
