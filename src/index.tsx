import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Contracts from './Contracts';
import ErrorPage from './Contracts/ErrorPage';
import SamSelikoff from './sam-selikoff';
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
        element: <SamSelikoff />,
      },
      {
        path: "line-chart-d3",
        element: <LineChartD3 />
      }
    ]
  },
  {
    path: "i18nx",
    element: <I18nx />
  },
  {
    path: "motion",
    children: [
      {
        path: "image-gallery",
        element: <ImageGallery />
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
