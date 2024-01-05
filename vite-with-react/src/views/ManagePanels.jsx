import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from "../axios.js";
import Users from '../components/Users';
import AddPermission from '../components/AddPermission';
import AddRole from '../components/AddRole.jsx';

function ManagePanels() {
  const { showToast, userRoles, setUserRoles} = useStateContext();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersWithRolesAndPermissions = async () => {
      try {
        const usersResponse = await axiosClient.get('/users/manage-panels');
        console.log(usersResponse.data);
        setUsers(usersResponse.data.users|| []);

      } catch (error) {
        console.error("An error occurred in fetchUsers", error);
        showToast("Error to load data", true);
      }
    };

    fetchUsersWithRolesAndPermissions().catch(error => {
      console.error("An error occurred in fetchUsers", error);
      showToast("An unexpected error occurred", true);
    });
  }, [showToast, navigate]);

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
  // const getUserPermissions = (user) => {
  //   const rolePermissions = user.roles && Array.isArray(user.roles)
  //     ? user.roles.flatMap(role => role.permissions ? role.permissions.map(perm => perm.name) : [])
  //     : [];
  //   const userPermissions = user.permissions && Array.isArray(user.permissions)
  //     ? user.permissions.map(perm => perm.name)
  //     : [];
  //   return Array.from(new Set([...rolePermissions, ...userPermissions]));
  // };



  const handleAddPermission = async (userId, permissionId) => {
    try {
      const response = await axiosClient.post('/users/permissions/add', {
        userId,
        permissionId
      });
      if (response.status === 200) {
        showToast('Permission added successfully', true);
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? { ...user, permissions: [...user.permissions, permissionId] }
              : user
          )
        );
      }
    } catch (error) {
      console.error("An error occurred in handleAddPermission", error);
      showToast("Error adding permission", true);
    }
  };

  const handleAddRole = async (roleName) => {
    try {
      const response = await axiosClient.post('/users/roles/add', {
        name: roleName
      });
      if (response.status === 200) {
        showToast('Role added successfully', true);
        setUserRoles(prevRoles => [...prevRoles, roleName]);
      }
    } catch (error) {
      console.error("An error occurred in handleAddRole", error);
      showToast("Error creating role", true);
    }
  };

  return (
    // <div className="container mx-auto px-4">
    //   <div className="flex flex-col">
    //     <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">Manage Panels</h2>
    //     <div className="mt-6">
    //     <div>
    //       <div className="mt-6">
    //         <div className="mb-4">
    //           <h3 className="text-lg leading-6 font-medium text-gray-900">Roles</h3>
    //         </div>
    //         <div className="bg-white shadow overflow-hidden sm:rounded-md">
    //         <ul>
    //           {userRoles.map(role => (
    //             <li key={role.id}>{role.name}</li>
    //           ))}
    //         </ul>
    //       </div>
    //       </div>
    //     <div className="mt-6">
    //       <form className="bg-white shadow overflow-hidden sm:rounded-md p-6">
    //         <div className="mb-4">
    //           <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">Role Name</label>
    //           <input type="text" name="roleName" id="roleName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
    //         </div>
    //         <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Role</button>
    //       </form>
    //     </div>
    //     </div>
    //     </div>
    //   </div>
    //   <Users users={users} onAddPermission={handleAddPermission} />
    //   <AddPermission onSubmit={handleAddPermission} />
    //   <AddRole onSubmit={handleAddRole} />
    // </div>

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
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Create Permission</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Create Role</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Add Permission</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Add Role</button>
      </div>
    </footer>
  </div>
);
}

export default ManagePanels;
