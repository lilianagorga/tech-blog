import React, { useEffect, useRef } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { refreshUserPermissionList } from "../utils/utils.jsx";

function UserPermissionsModal({
                                showModal,
                                handleModalToggle,
                                users,
                                permissions,
                                handleAssignPermission,
                                handleRevokePermission
}) {
  const { setPermissionToAdd, setPermissionToRevoke, setSelectedUser, userPermissionNames, setUserPermissionNames } = useStateContext();

  const modalRef = useRef();

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('mousedown', handleClickOutsidePermissionsModal);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => window.removeEventListener('mousedown', handleClickOutsidePermissionsModal);
  }, [showModal]);

  const handleClickOutsidePermissionsModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleModalToggle();
    }
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleModalToggle}>
        User Permissions
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white modal"
            ref={modalRef}
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">User Permissions Panel</h3>

              <div className="flex items-center justify-between">
                <label htmlFor="userSelect">Select User:</label>
                <select
                  id="userSelect"
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"
                  onChange={(e) => {
                    const selectedUserName = e.target.value;
                    const selectedUserObject = users.find(user => user.name === selectedUserName);
                    setSelectedUser(selectedUserObject);
                    refreshUserPermissionList(selectedUserObject, permissions, setUserPermissionNames);
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
                  <label htmlFor="permissionSelect">Select Permission:</label>
                  <select
                    id="permissionSelect"
                    onChange={(e) => {
                      const selectedPermission = userPermissionNames.find(permission => permission.name === e.target.value);
                      setPermissionToAdd(selectedPermission || {});
                    }}
                  >
                    <option value="">Select Permission</option>
                    {userPermissionNames.map((permission, index) => (
                      <option
                        key={index}
                        value={permission.name}
                        disabled={permission.directRevocable}
                      >
                        {permission.name}
                      </option>
                    ))}
                  </select>

                    <button
                      className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleAssignPermission}
                    >
                      Assign
                    </button>
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <label htmlFor="permissionSelect">Select Permission:</label>
                  <select
                    id="permissionSelect"
                    onChange={(e) => {
                      const selectedPermission = userPermissionNames.find(permission => permission.name === e.target.value);
                      setPermissionToRevoke(selectedPermission || {});
                    }}
                  >
                    <option value="">Select Permission</option>
                    {userPermissionNames.map((permission, index) => (
                      <option
                        key={index}
                        value={permission.name}
                        disabled={!permission.directRevocable}
                      >
                        {permission.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleRevokePermission}
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

export default UserPermissionsModal;
