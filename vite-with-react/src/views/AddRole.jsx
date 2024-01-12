import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import axiosClient from "../axios.js";
import { useLocation, useNavigate } from 'react-router-dom';

function AddRole() {
  const { userRoles, showToast, setUserRoles } = useStateContext();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoles, setSelectedRoles] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { users } = location.state || { users: [] };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedRoles.length) {
      showToast('Please select at least one role.');
      return;
    }

    const postData = {
      user_id: selectedUserId,
      roles: Array.isArray(selectedRoles)
        ? selectedRoles
        : [selectedRoles]
    };

    try {
      const response = await axiosClient.post('/users/roles/add', postData);

      if (response.status === 200) {
        showToast('Role added successfully');
        const updatedRoles = Array.isArray(selectedRoles) ? [...userRoles, ...selectedRoles] : [...userRoles, selectedRoles];
        setUserRoles(updatedRoles);
        localStorage.setItem('roles', JSON.stringify(updatedRoles));
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

    console.log('user id:', selectedUserId);
    console.log('User Roles:', userRoles);

  };

  const backToManagePanel = () => {
    navigate('/users/manage-panels');
  }

  return (
    <div>
      <h2>Add Role</h2>
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
          <label htmlFor="roleSelect">Select Role:</label>
          <select
            id="roleSelect"
            value={selectedRoles}
            onChange={(e) => setSelectedRoles(e.target.value)}
          >
            <option value="">Select Role</option>
            {userRoles.map((role, index) => (
              <option key={index} value={role.name}>
                {role}
              </option>
            ))}
          </select>

        </div>
        <button type="submit">Add Role</button><br />
        <button type="button"  onClick={backToManagePanel}>Back</button>
      </form>
    </div>
  );
}

export default AddRole;
