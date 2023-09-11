
import ReactDOM from 'react-dom/client';
import DraggableList from './drag/draggable-list-enter';
import InfiniteSlideshow from './drag/infinite-slideshow';
import './index.css';
import BottomSheetFixed from './motion/BottomSheetFixed';
import ReorderTest from './motion/reorder-test';
import reportWebVitals from './reportWebVitals';
import { Main } from './main'

import SpringTest from './useSpring/test'
import NestAnimate from './motion/NestAnimate';
import BottomSheetPanel from './motion/BottomSheetPanel';
import ControlInput from './ControlInput';
import RenderSetState from './rc18learn/RenderSetState';
import MovieApp from './movies';
import BenchMartHook from './BenchMartHook';
import RacFramerTabs from './rac-framer-tabs';
import UseLayoutEffectDemo from './rc18learn/useLayoutEffectDemo';
import FlushSyncLearn from './rc18learn/FlushSyncLearn';
import NextuiLearn from './nextui-learn';
import PortalLearn from './rc18learn/PortalLearn';
import CssFoldExample from './CssFoldExample';
import D3React from './d3-react';
import ImageGallery from './motion/image-gallery';
import EffectCoverflow from './swiper-demo/effect-coverflow';
import MotionCar from './motion/car'
import AnimatedNumberDemo from './motion/animated-number';
import AnimatedCounterDemo from './motion/animated-counter';
import MagnifiedDock from './motion/magnified-dock';
import LunDev from './lun-dev';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <LunDev />
  // <MagnifiedDock />
  // <AnimatedCounterDemo />
  // <AnimatedNumberDemo />
  // <MotionCar />
  // <EffectCoverflow />
  // <ImageGallery />
  // <D3React />
  // <CssFoldExample />
  // <AdobeSpectrumLearn />
  // <PortalLearn />
  // <NextuiLearn />
  // <FlushSyncLearn />
  // <UseLayoutEffectDemo />
  // <RedixLearn />
  // <DropdownMenu />
  // <RacFramerTabs />
  // <BenchMartHook />
  // <MovieApp />
  // <RenderSetState />
  // <ControlInput />
  // <NestAnimate initial={[1, 2, 3, 5]} />
  // <Main />
  // <ReorderTest />
  // <DraggableList />
  // <InfiniteSlideshow />
  // <BottomSheetPanel />
  // <SpringTest />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

