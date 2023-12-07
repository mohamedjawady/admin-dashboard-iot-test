import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './layout/Root';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard/users",
    element: <Dashboard users={true}/>
  },
  {
    path: "/dashboard/vehicles",
    element: <Dashboard users={false}/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);
