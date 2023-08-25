import { ComponentType, lazy, useState } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import Contracts from './Contracts';
import CardsStack from './drag/cards-stack';
import Sheet from './drag/sheet';
import InfiniteSlideshow from './drag/infinite-slideshow';
import I18nx from './i18nx';
import DragHandlerDemo from './react-beautiful-dnd/drag-handler-demo'
import Viewpaper from './drag/viewpaper';
import CardZoom from './drag/card-zoom';
import ScrollTabs from './drag/scroll-tabs';
import ImageGallery from './motion/image-gallery';
import ClickDropDown from './ClickDropDown'
import SimpleCodeEditor from './SimpleCodeEditor';
import Rc18Learn from "./rc18learn"
import RouterTest from './router-test';

function dynamic<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  args: (T extends ComponentType<infer M> ? M : {})
) {
  const Component = lazy(factory)
  return <Component {...args} />
}
function link(href: string, display?: string) {
  return <div>
    <a href={href}>{display || href}</a>
  </div>
}
function App() {
  return <>
    <Counter />
    {link("test")}
    <h1>drag</h1>
    {link("drag/scroll-index-demo")}
    {link("drag/draggable-list")}
    {link("drag/cards-stack")}
    {link("drag/sheet", `
      即bottom-sheet
    `)}
    {link("drag/infinite-slideshow", `
      无限拖动
    `)}
    {link("drag/viewpaper")}
    {link("drag/card-zoom")}
    {link("drag/scroll-tabs")}
    <h1>Motion</h1>
    {link("motion/image-gallery", `
      一个motion制作的单页的carousel
    `)}
    {link("motion/scroll")}
    {link("motion/scroll-demo3")}
    {link("motion/scroll-demo4")}
    {link("motion/useSpring-demo")}
    {link("motion/bottomsheet")}
    <h1>useSpring</h1>
    {link("use-spring/test")}
    {link("use-spring/parallax-demo")}
    {link("use-spring/parallax-demo2")}
    <h1>Sam</h1>
    {link("sam-selikoff/line-chart-d3")}
    {link("clickdropdown")}
    {link("simplecodeeditor")}
  </>
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  Contracts,
  {
    path: "router/1",
    element: <RouterTest to="/router/2" />
  },
  {
    path: "router/2",
    element: <RouterTest to="/router/1" >
      <button>test</button>
    </RouterTest>
  },
  {
    path: "test",
    element: <Test />
  },
  {
    path: "clickdropdown",
    element: <ClickDropDown />
  },
  {
    path: "sam-selikoff",
    children: [
      {
        index: true,
        element: dynamic(() => import("./sam-selikoff"), {}),
      },
      {
        path: "line-chart-d3",
        element: dynamic(() => import('./sam-selikoff/line-chart-d3'), {}),
      }
    ]
  },
  {
    path: "i18nx",
    element: <I18nx />
  },
  {
    path: "rc18learn",
    element: <Rc18Learn />
  },
  {
    path: "use-spring",
    children: [
      {
        path: "test",
        element: dynamic(() => import('./useSpring/test'), {})
      },
      {
        path: "parallax-demo",
        element: dynamic(() => import('./useSpring/parallax-demo'), {})
      },
      {
        path: "parallax-demo2",
        element: dynamic(() => import('./useSpring/parallax-demo2'), {})
      }
    ]
  },
  {
    path: "motion",
    children: [
      {
        path: "image-gallery",
        element: <ImageGallery />
      },
      {
        path: "scroll",
        element: dynamic(() => import('./motion/scroll'), {})
      },
      {
        path: "scroll-demo3",
        element: dynamic(() => import('./motion/scroll-demo3'), {})
      },
      {
        path: "scroll-demo4",
        element: dynamic(() => import('./motion/scroll-demo4'), {})
      },
      {
        path: "bottomsheet",
        element: dynamic(() => import('./motion/BottomSheetFixed'), {})
      },
      {
        path: "test",
        element: dynamic(() => import('./motion/motion-test'), {})
      },
      {
        path: "useSpring-demo",
        element: dynamic(() => import('./motion/useSpring-demo'), {})
      }
    ]
  },
  {
    path: "drag",
    children: [
      {
        path: "scroll-index-demo",
        element: dynamic(() => import("./drag/scroll-index-demo"), {})
      },
      {
        path: "draggable-list",
        element: dynamic(() => import('./drag/draggable-list'), {})
      },
      {
        path: "cards-stack",
        element: <CardsStack />
      },
      {
        path: "sheet",
        element: <Sheet />
      },
      {
        path: "infinite-slideshow",
        element: <InfiniteSlideshow />
      },
      {
        path: "viewpaper",
        element: <Viewpaper />
      },
      {
        path: "card-zoom",
        element: <CardZoom />
      },
      {
        path: "scroll-tabs",
        element: <ScrollTabs />
      }
    ]
  },
  {
    path: "react-beautiful-dnd",
    children: [
      {
        path: "drag-handler-demo",
        element: <DragHandlerDemo />
      }
    ]
  },
  {
    path: "simplecodeeditor",
    element: <SimpleCodeEditor />
  },
  {
    path: "giveaway"
  }
])

export function Main() {
  return <RouterProvider router={router} />
}

function Counter() {
  /**
   * Stack-View是替换模式,不能保存上一页面的data
   */
  const [count, setCount] = useState(0)
  return <button onClick={() => {
    setCount(v => v + 1)
  }}>点击{count}</button>
}

function Test() {
  const navigate = useNavigate()
  return <h1 className="text-3xl font-bold underline">
    Hello world!

    <button onClick={() => {
      navigate(-1)
    }}>Back</button>
  </h1>
}