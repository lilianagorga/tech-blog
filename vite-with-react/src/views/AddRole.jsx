import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import axiosClient from "../axios.js";

function AddRole() {
  const { currentUser, userRoles, showToast } = useStateContext();
  const [selectedRoles, setSelectedRoles] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedRoles.length) {
      showToast('Please select at least one role.');
      return;
    }

    const postData = {
      user_id: currentUser.id,
      roles: Array.isArray(selectedRoles)
        ? selectedRoles
        : [selectedRoles]
    };

    try {
      const response = await axiosClient.post('/users/roles/add', postData);

      if (response.status === 200) {
        showToast('Role added successfully');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log('Response data:', error.response.data);
        showToast(`Error: ${error.response.data.message}`);
      } else {
        console.error('Error adding role', error);
        showToast('Error adding role');
      }
    }

    console.log('Current User:', currentUser);
    console.log('User Roles:', userRoles);

  };

  return (
    <div>
      <h2>Add Role</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="roleSelect">Select Role:</label>
          <select
            id="roleSelect"
            value={selectedRoles}
            onChange={(e) => setSelectedRoles(e.target.value)}
          >
            <option value="">Select Role</option>
            {userRoles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>

        </div>
        <button type="submit">Add Role</button>
      </form>
    </div>
  );
}

export default AddRole;
