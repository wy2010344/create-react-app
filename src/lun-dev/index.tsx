import { PurePage } from "../PurePage";
import Carousel from "./carousel";
import SliderPizza from "./slider-pizza";


/**
 * Lun Dev的视频
 * https://github.com/HoanghoDev
 * @returns 
 */
export default function index() {
  return (
    <PurePage>
      <Carousel />
      {/* <SliderPizza /> */}
    </PurePage>
  )
}