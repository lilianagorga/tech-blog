import React, { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import {useLocation, useNavigate} from "react-router-dom";

function DeleteRole(){
  const location = useLocation();
  const navigate = useNavigate();
  const { users } = location.state || { users: [] };
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [rolesForSelectedUser, setRolesForSelectedUser] = useState([]);

  useEffect(() => {
    const selectedUser = users.find(user => user.id.toString() === selectedUserId);
    if (selectedUser) {
      setRolesForSelectedUser(selectedUser.roles.map(role => role.name));
    } else {
      setRolesForSelectedUser([]);
    }
  }, [selectedUserId, users]);

  const deleteUserRole = async () => {
    if (!selectedUserId || !selectedRoleId) {
      alert("Please select both user and role");
      return;
    }

    try {
      const response = await axiosClient.delete('/users/roles/delete', {
        data: {
          user_id: selectedUserId,
          roles: [selectedRoleId]
        }
      });
      alert("Role deleted successfully");
    } catch (error) {
      alert("Failed to delete role");
    }
  };

  const backToManagePanel = () => {
    navigate('/users/manage-panels');
  }

  return (
    <div>
      <h1>Delete Role</h1>
      <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
        <option value="">Select User</option>
        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
      </select>

      <select value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}>
        <option value="">Select Role</option>
        {rolesForSelectedUser.map((roleName, index) => (
          <option key={index} value={roleName}>{roleName}</option>
        ))}
      </select>

      <button onClick={deleteUserRole}>Delete Role</button><br />
      <button type="button"  onClick={backToManagePanel}>Back</button>
    </div>
  )
}

export default DeleteRole;
