import React, { useEffect, useRef } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";

function RoleWithAssociatedPermissionsModal({
                                              showModal,
                                              handleModalToggle,
                                              permissions,
                                              selectedRole,
                                              handleRoleSelection,
                                              handleUpdateRolePermissions


}) {

  const { rolesWithAssociatedPermissions, setSelectedPermissions, selectedPermissions } = useStateContext();

  useEffect(() => {
    if (selectedRole) {
      setSelectedPermissions(selectedRole.permissions.map(p => p.name));
    }
  }, [selectedRole]);


  const modalRef = useRef();

  const handleClickOutsideRolesModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleModalToggle();
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

  const handleRoleChange = (e) => {
    handleRoleSelection(e.target.value);
  };

  const handlePermissionChange = (permissionName) => {
    const updatedPermissions = selectedPermissions.includes(permissionName)
      ? selectedPermissions.filter(p => p !== permissionName)
      : [...selectedPermissions, permissionName];
    setSelectedPermissions(updatedPermissions);
  };

  const handleSubmit = () => {
    handleUpdateRolePermissions(selectedPermissions);
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleModalToggle}>
        PermissionRole
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white modal-size" ref={modalRef}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Update Roles Panel</h3>
              <div className="mt-4">
                <div>
                  <label htmlFor="roleSelect">Select Role:</label>
                  <select id="roleSelect" onChange={handleRoleChange} value={selectedRole?.name || ''}>
                    <option value="">Select a Role</option>
                    {rolesWithAssociatedPermissions.map((role) => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <label>Permissions:</label>
                  {permissions.map((permission) => (
                    <div key={permission}>
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                      />
                      {permission}
                    </div>
                  ))}
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSubmit}
                >
                  Update Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleWithAssociatedPermissionsModal;
