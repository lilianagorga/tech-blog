import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from "../axios.js";
import {getUserPermissions} from "../utils/utils.jsx";
import PageComponent from "../components/PageComponent.jsx";
import PermissionsModal from "../components/PermissionsModal.jsx";
import UserPermissionsModal from "../components/UserPermissionsModal.jsx";

function ManagePanel() {
  const { showToast, permissions, setPermissions, roles, setRoles, currentUser } = useStateContext();
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownValue, setDropdownValue] = useState('');
  const [permissionName, setPermissionName] = useState('');
  const [permissionToDelete, setPermissionToDelete] = useState('');

  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showUserPermissionsModal, setShowUserPermissionsModal] = useState(false);

  const joinedPermissions = [];

  const handlePermissionsModalToggle = () => {
    setShowPermissionsModal(!showPermissionsModal);
  };

  const handleUserPermissionsModalToggle = () => {
    setShowUserPermissionsModal(!showUserPermissionsModal);
  };
  const handleDropdownChange = (e) => setDropdownValue(e.target.value);

  useEffect(() => {
    let isMounted = true;
      const fetchUsersWithRolesAndPermissions = async ()=>{
        try {
          const response = await axiosClient.get('/users/manage-panels');

          if (isMounted) {
            console.log("response:", response.data);

            const filteredUsers = response.data.users.filter(user=>{
              const userPermissions = getUserPermissions(user);
              const userRoles = getUserRoles(user);

              return userPermissions.length > 0 || userRoles.length > 0;
            });

            setUsers(filteredUsers || []);

            if (JSON.stringify(permissions) !== JSON.stringify(response.data.permissions)) {
              setPermissions(response.data.permissions || []);
              console.log(response.data.permissions);
            }

            if (JSON.stringify(roles) !== JSON.stringify(response.data.roles)) {
              setRoles(response.data.roles || []);
              console.log(response.data.roles);
            }

            setLoading(false);
            setIsAdmin(response.data.isAdmin);
          }
        } catch (error) {
          if (isMounted) {
            console.error("An error occurred in fetchUsers", error);
            showToast("Error to load data", true);
          }
          setLoading(false);
        }
      };

      fetchUsersWithRolesAndPermissions().catch(error=>{
        console.error("An error occurred in fetchUsers", error);
        showToast("An unexpected error occurred", true);
      });
    return () => {
      isMounted = false;
      console.log('ManagePanel Unmounting');
    };
  }, []);

  const handleCreatePermission = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/users/permissions', { name: permissionName });
      if (response.status === 201) {
        const updatedPermissions = [...permissions, permissionName];
        // localStorage.setItem('permissions', JSON.stringify(updatedPermissions));
        setPermissions(updatedPermissions)
        setShowPermissionsModal(false);
        setPermissionName('');
        console.log("Permission created successfully:", response.data);
      }
    } catch (error) {
      console.error("Error creating permission", error);
    }
  };

  const handleDeletePermission = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.delete(`/users/permissions/delete?name=${permissionToDelete}`);
      if (response.status === 204) {
        setShowPermissionsModal(false);
        const updatedPermissions = permissions.filter(permission => permission !== permissionToDelete);
        setPermissions(updatedPermissions);
        console.log("Permission created successfully:", response.data);
      }
    } catch (error) {
      console.error("Error creating permission", error);
    }
  };

  const getUserRoles = (user) => {
    return user.roles.map(role => role.name).join(', ');
  };

  console.log('ManagePanel Rendering');
  console.log('user role:',roles);
  console.log('user permission:', permissions);
  console.log('current user from manage panel:', currentUser);

  return (
  <PageComponent title="Manage Panel">
    {loading && <div className="flex justify-center">Loading...</div>}
    {!loading && (
      <div className="container mx-auto pt-2 mt-2">
      <div className="grid grid-cols-10 gap-4">
        <aside className="col-span-2 bg-gray-200 p-4" aria-label="Sidebar">
          <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
            <ul className="space-y-2">
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
        <div className="grid grid-cols-6 m-8 p-8 bg-gray-800 gap-8 rounded">
          {/*<Link to="/users/permissions" className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>*/}
          {/*  Create Permission*/}
          {/*</Link>*/}

          {/*<Link to="/users/roles" state={{ permissions: permissions }} className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>*/}
          {/*  Create Role*/}
          {/*</Link>*/}

          {/*<Link to="/users/permissions/add" state={{ users: users }} className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>*/}
          {/*  Add Permission*/}
          {/*</Link>*/}

          {/*<Link to="/users/roles/add" state={{ users: users }} className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>*/}
          {/*  Add Role*/}
          {/*</Link>*/}

          {/*<Link to="/users/roles/delete" state={{ users: users }} className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>*/}
          {/*  Delete Role*/}
          {/*</Link>*/}

          {/*<Link to="/users/permissions/delete" state={{ users: users, permissions: permissions }} className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={e => !isAdmin && e.preventDefault()}>*/}
          {/*  Delete Permission*/}
          {/*</Link>*/}

          <PermissionsModal
            showModal={showPermissionsModal}
            handleModalToggle={handlePermissionsModalToggle}
            permissionName={permissionName}
            setPermissionName={setPermissionName}
            permissions={permissions}
            setPermissionToDelete={setPermissionToDelete}
            handleCreatePermission={handleCreatePermission}
            handleDeletePermission={handleDeletePermission}
          />

          <UserPermissionsModal
            showModal={showUserPermissionsModal}
            handleModalToggle={handleUserPermissionsModalToggle}
            users={users}
          />

        </div>
      </footer>
    </div>
    )}
  </PageComponent>
);
}

export default ManagePanel;
