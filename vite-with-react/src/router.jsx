import {createBrowserRouter} from "react-router-dom";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import ManagePanel from "./views/ManagePanel.jsx";
import ManageCategories from "./views/ManageCategories.jsx";
import Category from "./views/Category.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <Home/>,
      },
      {
        path: 'manage-panels',
        element: <ManagePanel/>
      },
      {
        path: 'categories',
        element: <ManageCategories />,
      },
      {
        path: '/:categoryName',
        element: <Category />
      }
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
  }
])

export default router;
