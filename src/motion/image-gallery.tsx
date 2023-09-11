import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, wrap } from "framer-motion";
import styled from 'styled-components';
import { useEvent } from '../useEvent';

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};
const images = [
  "https://d33wubrfki0l68.cloudfront.net/dd23708ebc4053551bb33e18b7174e73b6e1710b/dea24/static/images/wallpapers/shared-colors@2x.png",
  "https://d33wubrfki0l68.cloudfront.net/49de349d12db851952c5556f3c637ca772745316/cfc56/static/images/wallpapers/bridge-02@2x.png",
  "https://d33wubrfki0l68.cloudfront.net/594de66469079c21fc54c14db0591305a1198dd6/3f4b1/static/images/wallpapers/bridge-01@2x.png"
];

/**
 * 可以做无限滚动 carousel
 * @returns 
 */
export default function ImageGallery() {
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = wrap(0, images.length, page)
  const paginate = useEvent(function (direction: number) {
    setPage([page + direction, direction])
  })

  const [onDrag, setOnDrag] = useState(false)
  useEffect(() => {
    if (!onDrag) {
      const inv = setInterval(() => {
        paginate(1)
      }, 3000)
      return function () {
        clearInterval(inv)
      }
    }
  }, [onDrag])

  const imgRef = useRef<HTMLImageElement>(null)
  console.log(imgRef)
  return (
    <ImageGalleryWrapper
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img ref={imgRef}
          key={page}
          src={images[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              type: "spring",
              stiffness: 300,
              damping: 30
            },
            opacity: {
              duration: 0.2
            }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragStart={() => {
            setOnDrag(true)
          }}
          onDragEnd={(e, { offset, velocity, ...args }) => {
            const halfWidth = (imgRef.current?.clientWidth || 0) / 2
            console.log(offset.x, halfWidth)
            if (offset.x < -halfWidth) {
              paginate(1)
            } else if (offset.x > halfWidth) {
              paginate(-1)
            }
            setOnDrag(false)
            return

            const swipe = swipePower(offset.x, velocity.x);
            console.log(swipe, imgRef.current?.clientWidth, offset.x, velocity, swipeConfidenceThreshold)
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
            setOnDrag(false)
          }}
        />
      </AnimatePresence>
      <div className="next" onClick={() => paginate(1)}>
        {"‣"}
      </div>
      <div className="prev" onClick={() => paginate(-1)}>
        {"‣"}
      </div>
    </ImageGalleryWrapper>
  )
}
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};


const ImageGalleryWrapper = styled.div`

width: 100vw;
height: 100vh;
position: relative;
display: flex;
justify-content: center;
align-items: center;

.next,
.prev {
  top: calc(50% - 20px);
  position: absolute;
  background: white;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  z-index: 2;
}

.next {
  right: 10px;
}

.prev {
  left: 10px;
  transform: scale(-1);
}

img {
  position: absolute;
  max-width: 100vw;
}
`