import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import axiosClient from "../axios.js";
import { useLocation, useNavigate } from 'react-router-dom';

function AddPermission() {
  const { permissions, showToast, setPermissions } = useStateContext();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { users } = location.state || { users: [] };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPermissions.length) {
      showToast('Please select at least one permission.');
      return;
    }

    const postData = {
      user_id: selectedUserId,
      permissions: Array.isArray(selectedPermissions)
        ? selectedPermissions
        : [selectedPermissions]
    };

  try {
    const response = await axiosClient.post('/users/permissions/add', postData);

    if (response.status === 200) {
      showToast('Permission added successfully');
      const updatedPermissions = Array.isArray(selectedPermissions) ? [...permissions, ...selectedPermissions] : [...permissions, selectedPermissions];
      setPermissions(updatedPermissions);
      localStorage.setItem('permissions', JSON.stringify(updatedPermissions));
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.log('Response data:', error.response.data);
      showToast(`Error: ${error.response.data.message}`);
    } else {
      console.error('Error adding permission', error);
      showToast('Error adding permission');
    }
  }
    console.log('user id:', selectedUserId);
    console.log('User Permissions:', permissions);

  };

  const backToManagePanel = () => {
    navigate('/users/manage-panels');
  }

  return (
    <div>
      <h2>Add Permission</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userSelect">Select User:</label>
          <select
            id="userSelect"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users && users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="permissionSelect">Select Permission:</label>
          <select
            id="permissionSelect"
            value={selectedPermissions}
            onChange={(e) => setSelectedPermissions(e.target.value)}
          >
            <option value="">Select Permission</option>
            {permissions.map((permission, index) => (
              <option key={index} value={permission.name}>
                {permission}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Permission</button><br />
        <button type="button"  onClick={backToManagePanel}>Back</button>
      </form>
    </div>
  );
}

export default AddPermission;
