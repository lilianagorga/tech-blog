import React, {useEffect, useRef } from "react";
import { useStateContext } from '../contexts/ContextProvider';
import { refreshUserRoleLists } from "../utils/utils.jsx";

function UserRolesModal({
                          showModal,
                          handleModalToggle,
                          users,
                          roles,
                          handleRevokeRole,
                          handleAssignRole
}) {
const { setRoleToAdd, setRoleToRevoke, setSelectedUser, userRoleNames, setUserRoleNames } = useStateContext();

  const modalRef = useRef();

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
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white modal"
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
                    refreshUserRoleLists(selectedUserObject, roles, setUserRoleNames);
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
