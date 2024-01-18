import {createBrowserRouter} from "react-router-dom";
import Dashboard from "./views/Dashboard.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import ManagePanel from "./views/ManagePanel.jsx";
import Post from "./views/Post.jsx";
import ManageCategories from "./views/ManageCategories.jsx";
import Comment from "./views/Comment.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard/>,
      },
      {
        path: 'manage-panels',
        element: <ManagePanel/>
      },
      {
        path: '/categories',
        element: <ManageCategories />,
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
    path: '/comments',
    element: <Comment />,
  },
])

export default router;
