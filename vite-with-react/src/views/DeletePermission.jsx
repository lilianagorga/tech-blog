import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {getUserPermissions} from "../utils/utils.jsx";
import axiosClient from "../axios.js";

function DeletePermission(){
  const location = useLocation();
  const { users, permissions } = location.state || { users: [], permissions: [] };
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');
  const [permissionsForSelectedUser, setPermissionsForSelectedUser] = useState([]);

  useEffect(() => {
    const selectedUser = users.find(user => user.id.toString() === selectedUserId);
    if (selectedUser) {
      const userPermissions = getUserPermissions(selectedUser);
      setPermissionsForSelectedUser(userPermissions);
    } else {
      setPermissionsForSelectedUser([]);
    }
  }, [selectedUserId, users]);

  const deleteUserPermission = async () => {
    if (!selectedUserId || !selectedPermission) {
      alert("Please select both user and permission");
      return;
    }

    try {
      const response = await axiosClient.delete('/users/permissions/delete', {
        data: {
          user_id: selectedUserId,
          permissions: [selectedPermission]
        }
      });
      alert("Permission deleted successfully");
    } catch (error) {
      alert("Failed to delete permission");
    }
  };


  return (
    <div>
      <h1>Delete Permission</h1>
      <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
        <option value="">Select User</option>
        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
      </select>
      <select value={selectedPermission} onChange={(e) => setSelectedPermission(e.target.value)}>
        <option value="">Select Permission</option>
        {permissionsForSelectedUser.map((perm) => (
          <option key={perm} value={perm}>{perm}</option>
        ))}
      </select>
      <button onClick={deleteUserPermission}>Delete Permission</button>
    </div>
  )
};

export default DeletePermission;
