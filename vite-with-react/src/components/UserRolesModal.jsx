import React, {useEffect, useRef, useState} from "react";
import axiosClient from "../axios.js";

function UserRolesModal({ showModal, handleModalToggle, users, roles }) {
  const [roleToAdd, setRoleToAdd] = useState({});
  const [roleToRevoke, setRoleToRevoke] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [userRoleNames, setUserRoleNames] = useState([]);

  const modalRef = useRef();

  const getUserRoles = (user) => {
    return user.roles.map(role => role.name).join(', ');
  };

  const buildAddableRoles = (user, listOfRoles) => {
    const roles = getUserRoles(user);
    let updatedRoles = listOfRoles.map(role => {
      return {
        name: role,
        disabled: roles.includes(role)
      };
    });

    updatedRoles.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return a.name.localeCompare(b.name);
    });

    setUserRoleNames(updatedRoles);
  }

  useEffect(() => {

  }, [selectedUser, userRoleNames]);

  const handleAssignRole = async (event) => {
    event.preventDefault();
    if (roleToAdd && selectedUser) {
      const payload = {
        user_id: selectedUser.id,
        name: roleToAdd.name
      };
      try {
        const response = await axiosClient.post('/roles/add', payload);
        if (response.status === 200) {
          const newUserRoles = [...selectedUser.roles, roleToAdd];
          const updatedUser = { ...selectedUser, roles: newUserRoles };
          console.log("selectedUser", selectedUser.roles);
          setSelectedUser(updatedUser);
          console.log("updatedUser", updatedUser.roles);
          buildAddableRoles(updatedUser, roles);
          handleModalToggle()
          console.log("Role added successfully");
        } else {
          console.log("Role not added");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      console.log("Missing roleToAdd or selectedUser");
    }
  };

  const handleRevokeRole = async (e) => {
    e.preventDefault();
    if (roleToRevoke && selectedUser) {
      const payload = {
        user_id: selectedUser.id,
        name: roleToRevoke.name
      };
      try {
        const response = await axiosClient.post('/roles/revoke', payload);
        if (response.status === 200) {
          const revokedUserRoles = [...selectedUser.roles, roleToRevoke];
          const updatedUser = { ...selectedUser, roles: revokedUserRoles };
          console.log("selectedUser", selectedUser.roles);
          setSelectedUser(updatedUser);
          console.log("updatedUser", updatedUser.roles);
          buildAddableRoles(updatedUser, roles);
          handleModalToggle()
          console.log("Role revoked successfully");
        } else {
          console.log("Role not revoked");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      console.log("Missing roleToRevoke or selectedUser");
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('mousedown', handleClickOutsideRolesModal);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => window.removeEventListener('mousedown', handleClickOutsideRolesModal);
  }, [showModal]);

  const handleClickOutsideRolesModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleModalToggle();
    }
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleModalToggle}>
        User Roles
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            ref={modalRef}
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">User Roles Panel</h3>

              <div className="flex items-center justify-between">
                <label htmlFor="userSelect">Select User:</label>
                <select
                  id="userSelect"
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"
                  onChange={(e) => {
                    const selectedUserName = e.target.value;
                    const selectedUserObject = users.find(user => user.name === selectedUserName);
                    setSelectedUser(selectedUserObject);
                    buildAddableRoles(selectedUserObject, roles);
                  }}>
                  <option value="">Select User</option>
                  {
                    users && users.map((user) =>
                      <option key={user.id} value={user.name}>{user.name}</option>
                    )
                  }
                </select>
              </div>

              <div className="mt-4">
                <div>
                  <label htmlFor="roleSelect">Select Role:</label>
                  <select
                    id="roleSelect"
                    onChange={(e) => {
                      const selectedRole = userRoleNames.find(role => role.name === e.target.value);
                      setRoleToAdd(selectedRole || {});
                    }}
                  >
                    <option value="">Select Role</option>
                    {userRoleNames.map((role, index) => (
                      <option
                        key={index}
                        value={role.name}
                        disabled={role.disabled}
                      >
                        {role.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAssignRole}
                  >
                    Assign
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <label htmlFor="roleSelect">Select Role:</label>
                  <select
                    id="roleSelect"
                    onChange={(e) => {
                      const selectedRole = userRoleNames.find(role => role.name === e.target.value);
                      setRoleToRevoke(selectedRole || {});
                    }}
                  >
                    <option value="">Select Role</option>
                    {userRoleNames.map((role, index) => (
                      <option
                        key={index}
                        value={role.name}
                        disabled={!role.disabled}
                      >
                        {role.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleRevokeRole}
                  >
                    Revoke
                  </button>
                </div>
              </div>

              <hr className="my-4" />

              <div className="mt-4">
                <button
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={handleModalToggle}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRolesModal;
