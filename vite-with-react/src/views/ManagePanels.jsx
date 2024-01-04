import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from "../axios.js";

function ManagePanels() {
  const { currentUser, userToken, showToast } = useStateContext();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      showToast("Access Required", true);
      navigate("/user/login");
      return;
    }
    const fetchUsersRolesAndPermissions = async () => {
      try {
        const usersResponse = await axiosClient.get('/users/manage-panels');
        console.log(usersResponse.data);
        setUsers(usersResponse.data);
        const rolesResponse = await axiosClient.get('/users/roles');
        setRoles(rolesResponse.data);
        const permissionsResponse = await axiosClient.get('/users/permissions');
        setPermissions(permissionsResponse.data);

      } catch (error) {
        showToast("Error to load data", true);
      }
    };

    fetchUsersRolesAndPermissions().catch(error => {
      console.error("An error occurred in fetchUsersRolesAndPermissions", error);
      showToast("An unexpected error occurred", true);
    });
  }, [userToken, showToast, navigate]);

  return (
    <div>
      <h2>Manage Panels</h2>
      <div>
        <h3>Users</h3>
        <ul>
          {Array.isArray(users) && users.map(user => (
            <li key={user.id}>{user.name} - {user.email}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Roles</h3>
        <ul>
          {roles.map(role => (
            <li key={role.id}>{role.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Permissions</h3>
        <ul>
          {permissions.map(permission => (
            <li key={permission.id}>{permission.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManagePanels;
