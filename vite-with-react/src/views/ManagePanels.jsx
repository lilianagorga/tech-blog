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
    <div className="container mx-auto px-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">Manage Panels</h2>
        <div className="mt-6">
        <div>
          <div className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Roles</h3>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul>
              {userRoles.map(role => (
                <li key={role.id}>{role.name}</li>
              ))}
            </ul>
          </div>
          </div>
        <div className="mt-6">
          <form className="bg-white shadow overflow-hidden sm:rounded-md p-6">
            <div className="mb-4">
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">Role Name</label>
              <input type="text" name="roleName" id="roleName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Role</button>
          </form>
        </div>
        </div>
        </div>
      </div>
      <Users users={users} onAddPermission={handleAddPermission} />
      <AddPermission onSubmit={handleAddPermission} />
      <AddRole onSubmit={handleAddRole} />
    </div>
  );
}

export default ManagePanels;
