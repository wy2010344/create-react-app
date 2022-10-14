import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Contracts from './Contracts';
import ErrorPage from './Contracts/ErrorPage';
import SamSelikoff from './sam-selikoff';


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
    path: "sam-selikoff",
    element: <SamSelikoff />
  }
])
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
