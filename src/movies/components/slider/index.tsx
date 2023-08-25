import { useChange } from '@wangyang2010344/react-helper';
import type { FC, ReactNode } from 'react';
import Slick, { Settings } from 'react-slick'
import './slider.css'
interface SliderProps extends Omit<Settings, 'children'> {
  isMovieCard?: boolean
  isSeasonCard?: boolean
  children?(onSwipe: boolean): ReactNode
}

const Slider: FC<SliderProps> = (props) => {
  let settings: Omit<Settings, 'children'> = {
    ...props,
  }

  if (props.isMovieCard) {
    settings = {
      ...settings,
      infinite: true,
      swipe: false,
      slidesToShow: 5,
      slidesToScroll: 5,
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    }
  }

  const [onSwipe, setOnSwipe] = useChange(false)
  return (<Slick
    autoplay={false}
    {...settings}
    autoplaySpeed={5000}
    onSwipe={() => setOnSwipe(true)}
    afterChange={() => setOnSwipe(false)}
  >
    {props.children?.(onSwipe)}
  </Slick>);
}

export default Slider;
