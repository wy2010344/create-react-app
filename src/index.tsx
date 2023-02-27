import React, { ComponentType, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Contracts from './Contracts';
import ErrorPage from './Contracts/ErrorPage';
import DraggableList from './drag/draggable-list';
import CardsStack from './drag/cards-stack';
import Sheet from './drag/sheet';
import InfiniteSlideshow from './drag/infinite-slideshow';
import I18nx from './i18nx';
import DragHandlerDemo from './react-beautiful-dnd/drag-handler-demo'
import Viewpaper from './drag/viewpaper';
import CardZoom from './drag/card-zoom';
import ScrollTabs from './drag/scroll-tabs';
import ImageGallery from './motion/image-gallery';
import LineChartD3 from './sam-selikoff/line-chart-d3';
import ClickDropDown from './ClickDropDown'
import SimpleCodeEditor from './SimpleCodeEditor';
import Scroll from './motion/scroll';
import Rc18Learn from "./rc18learn"
import ButtonSheetFixed from './motion/ButtonSheetFixed';
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
    {link("test")}
    {link("drag/draggable-list")}
    {link("drag/cards-stack")}
    {link("drag/sheet")}
    {link("drag/infinite-slideshow")}
    {link("drag/viewpaper")}
    {link("drag/card-zoom")}
    {link("drag/scroll-tabs")}
    {link("motion/image-gallery")}
    {link("motion/scroll")}
    {link("sam-selikoff/line-chart-d3")}
    {link("clickdropdown")}
    {link("simplecodeeditor")}
    {link("motion/buttonSheet")}
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
    element: <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
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
        path: "bottomSheet",
        element: dynamic(() => import('./motion/ButtonSheetFixed'), {})
      },
      {
        path: "test",
        element: dynamic(() => import('./motion/motion-test'), {})
      }
    ]
  },
  {
    path: "drag",
    children: [
      {
        path: "draggable-list",
        element: <DraggableList />
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
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RouterProvider router={router} />
  // <React.StrictMode>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
