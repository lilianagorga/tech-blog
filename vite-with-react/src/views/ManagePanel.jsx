import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from "../axios.js";

function ManagePanel() {
  const { showToast, userPermissions, setUserPermissions, userRoles, setUserRoles, currentUser } = useStateContext();
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchUsersWithRolesAndPermissions = async () => {
      try {
        const usersResponse = await axiosClient.get('/users/manage-panels');
        if (isMounted) {
          console.log("users:", usersResponse.data);
          setUsers(usersResponse.data.users || []);
          if (JSON.stringify(userPermissions) !== JSON.stringify(usersResponse.data.permissions)) {
            setUserPermissions(usersResponse.data.permissions || []);
            console.log(usersResponse.data.permissions);
          }
          if (JSON.stringify(userRoles) !== JSON.stringify(usersResponse.data.roles)) {
            setUserRoles(usersResponse.data.roles || []);
            console.log(usersResponse.data.roles);
          }
          setIsAdmin(usersResponse.data.isAdmin);
        }
      } catch (error) {
        if (isMounted) {
          console.error("An error occurred in fetchUsers", error);
          showToast("Error to load data", true);
        }
      }
    };

    fetchUsersWithRolesAndPermissions().catch(error => {
      console.error("An error occurred in fetchUsers", error);
      showToast("An unexpected error occurred", true);
    });
    return () => {
      isMounted = false;
    };
  }, [showToast, navigate, userPermissions, setUserPermissions, userRoles, setUserRoles]);

  const getUserPermissions = (user) => {
    const rolePermissions = user.roles
      ? user.roles.flatMap(role => role.permissions ? role.permissions.map(perm => perm.name) : [])
      : [];
    const directPermissions = user.permissions
      ? user.permissions.map(perm => perm.name)
      : [];
    return Array.from(new Set([...rolePermissions, ...directPermissions]));
  };

  const getUserRoles = (user) => {
    return user.roles.map(role => role.name).join(', ');
  };

  console.log('current user from manage panel:', currentUser);

  return (
  <div className="container mx-auto pt-2 mt-2">
    <div className="grid grid-cols-10 gap-4">
      <aside className="col-span-2 bg-gray-200 p-4" aria-label="Sidebar">
        <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
          <ul className="space-y-2">
            <li>
              <a href="/" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="ml-3">Home</span>
              </a>
            </li>
            <li>
              <a href="/posts" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="ml-3">Posts</span>
              </a>
            </li>
            <li>
              <a href="/categories" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="ml-3">Category</span>
              </a>
            </li>
            <li>
              <a href="/comments" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="ml-3">Comments</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <main className="col-span-8 p-4 border-l-2 border-r-2">
        <div className="grid grid-cols-4 gap-4 border-b-2">
          <h3 className="col-span-1 text-lg font-bold text-center">Email</h3>
          <h3 className="col-span-2 text-lg font-bold text-center">Permissions</h3>
          <h3 className="col-span-1 text-lg font-bold text-center">Roles</h3>
        </div>
        <div className="grid grid-cols-4 gap-4 py-2">
          {users.map((user, index) => (
            <React.Fragment key={user.id}>
              <div className={`col-span-1 p-2`}>
                {user.email}
              </div>
              <div className={`col-span-2 p-2`}>
                {getUserPermissions(user).join(', ')}
              </div>
              <div className={`col-span-1 p-2`}>
                {getUserRoles(user)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </main>
    </div>
    <footer className="mt-4 p-4 bg-gray-200">
      <div className="grid grid-cols-4 m-8 p-8 bg-gray-800 gap-8 rounded">
        <Link to="/users/permissions" className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>
          Create Permission
        </Link>
        <Link to="/users/roles" state={{ permissions: userPermissions }} className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>
          Create Role
        </Link>
        <Link to="/users/permissions/add" state={{ users: users }} className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>
          Add Permission
        </Link>
        <Link to="/users/roles/add" state={{ users: users }} className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>
          Add Role
        </Link>
      </div>
    </footer>
  </div>
);
}

export default ManagePanel;
