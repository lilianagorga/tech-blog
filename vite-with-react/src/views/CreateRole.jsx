import React, { useState } from "react";
import axiosClient from "../axios.js";
import { useLocation, useNavigate } from 'react-router-dom';

function CreateRole() {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { permissions } = location.state || { permissions: [] };

  const handlePermissionChange = (e) => {
    const value = e.target.value;
    setSelectedPermissions(
      e.target.checked
        ? [...selectedPermissions, value]
        : selectedPermissions.filter(permission => permission !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/users/roles', {
        name,
        permissions: selectedPermissions
      });
      console.log("Role created successfully:", response.data);
    } catch (error) {
      console.error("Error creating role", error);
    }
  };

  const backToManagePanel = () => {
    navigate('/users/manage-panels');
  }

  return (
    <div>
      <h2>Create New Role</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Role Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Permissions:</label>
          {permissions.map(permission => (
            <div key={permission}>
              <input
                type="checkbox"
                value={permission}
                checked={selectedPermissions.includes(permission)}
                onChange={handlePermissionChange}
              />
              {permission}
            </div>
          ))}
        </div>
        <button type="submit">Create Role</button><br />
        <button type="button"  onClick={backToManagePanel}>Back</button>
      </form>
    </div>
  );
}

export default CreateRole;

