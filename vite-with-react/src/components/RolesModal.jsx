import React, { useEffect, useRef } from 'react';

function RolesModal({
                      showModal,
                      handleModalToggle,
                      roleName,
                      setRoleName,
                      roles,
                      setRoleToDelete,
                      handleCreateRole,
                      handleDeleteRole
                    }) {
  const modalRef = useRef();

  const handleClickOutsideRoleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleModalToggle();
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('mousedown', handleClickOutsideRoleModal);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => window.removeEventListener('mousedown', handleClickOutsideRoleModal);
  }, [showModal]);

  return (
    <div className="p-4">
      <button
        data-testid="open-roles-modal"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleModalToggle}>
        Roles
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            ref={modalRef}
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Roles Panel</h3>
              <div className="mt-4">
                <div>
                  <input
                    type="text"
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"
                    value={roleName}
                    placeholder="enter a name"
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleCreateRole}
                >
                  Create Role
                </button>
              </div>

              <hr className="my-4" />

              <div className="flex items-center justify-between">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"
                  onChange={(e) => setRoleToDelete(e.target.value)}>
                  <option value="">Select Role</option>
                  {
                    roles.map((role, index) =>
                      <option key={index} value={role}>{role}</option>
                    )
                  }
                </select>

                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleDeleteRole}
                >
                  DELETE
                </button>
              </div>

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

export default RolesModal;
