import React, { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import axios from 'axios';
import axiosClient from "../axios.js";

function AddPermission() {
  const { currentUser, userPermissions, setUserPermissions, showToast } = useStateContext();
  const [selectedPermissions, setSelectedPermissions] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPermissions.length) {
      showToast('Please select at least one permission.');
      return;
    }

    const postData = {
      user_id: currentUser.id,
      permissions: Array.isArray(selectedPermissions)
        ? selectedPermissions
        : [selectedPermissions]
    };

  try {
    const response = await axiosClient.post('/users/permissions/add', postData);

    if (response.status === 200) {
      showToast('Permission added successfully');
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

    console.log('Current User:', currentUser);
    console.log('User Permissions:', userPermissions);

  };

  return (
    <div>
      <h2>Add Permission</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="permissionSelect">Select Permission:</label>
          <select
            id="permissionSelect"
            value={selectedPermissions}
            onChange={(e) => setSelectedPermissions(e.target.value)}
          >
            <option value="">Select Permission</option>
            {userPermissions.map((permission, index) => (
              <option key={index} value={permission}>
                {permission}
              </option>
            ))}
          </select>

        </div>
        <button type="submit">Add Permission</button>
      </form>
    </div>
  );
}

export default AddPermission;
