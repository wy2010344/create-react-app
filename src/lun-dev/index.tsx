import { PurePage } from "../PurePage";
import Carousel from "./carousel";
import SliderPizza from "./slider-pizza";
import ThreeDModel from './3dmodel'
import DragSlider from './drag_slider'
/**
 * Lun Dev的视频
 * https://github.com/HoanghoDev
 * @returns 
 */
export default function index() {
  return (
    <PurePage>
      <DragSlider />
      {/* <ThreeDModel /> */}
      {/* <Carousel /> */}
      {/* <SliderPizza /> */}
    </PurePage>
  )
}