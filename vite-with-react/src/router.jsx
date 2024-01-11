import {createBrowserRouter} from "react-router-dom";
import Dashboard from "./views/Dashboard.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import ManagePanel from "./views/ManagePanel.jsx";
import AddPermission from "./views/AddPermission.jsx";
import AddRole from "./views/AddRole.jsx";
import CreateRole from "./views/CreateRole.jsx";
import CreatePermission from "./views/CreatePermission.jsx";
import DeletePermission from "./views/DeletePermission";
import DeleteRole from "./views/DeleteRole";
import Post from "./views/Post.jsx";
import Category from "./views/Category.jsx";
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
        path: 'users/manage-panels',
        element: <ManagePanel/>
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
    path: '/users/permissions/add',
    element: <AddPermission />
  },
  {
    path: '/users/roles/add',
    element: <AddRole />,
  },
  {
    path: '/users/roles',
    element: <CreateRole />,
  },
  {
    path: '/users/permissions',
    element: <CreatePermission />,
  },
  {
    path: '/users/permissions/delete',
    element: <DeletePermission />,
  },
  {
    path: '/users/roles/delete',
    element: <DeleteRole />,
  },

  {
    path: '/posts',
    element: <Post />,
  },
  {
    path: '/categories',
    element: <Category />,
  },
  {
    path: '/comments',
    element: <Comment />,
  },
])

export default router;
