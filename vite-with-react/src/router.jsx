import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./views/Dashboard.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import ManagePanels from "./views/ManagePanels.jsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Navigate to="/" />
      },
      {
        path: '',
        element: <Dashboard/>
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: 'user/login',
        element: <Login />
      },
      {
        path: 'user/register',
        element: <Register />
      }
    ]
  },
  {
    path: '/users/manage-panels',
    element: <ManagePanels />,
  },
])

export default router;
