import React, { useEffect, useRef, useState } from 'react';

function UserPermissionsModal({
                            showModal,
                            handleModalToggle,
                            users,
                            // permissionName,
                            // setPermissionName,
                            // permissions,
                            // setPermissionToDelete,
                            // handleCreatePermission,
                            // handleDeletePermission,
                          }) {

  const [selectedUser, setSelectedUser] = useState({});

  const modalRef = useRef();

  const handleClickOutsidePermissionsModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleModalToggle();
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('mousedown', handleClickOutsidePermissionsModal);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => window.removeEventListener('mousedown', handleClickOutsidePermissionsModal);
  }, [showModal]);

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
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            ref={modalRef}
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">User Permissions Panel</h3>

              <div className="flex items-center justify-between">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"
                  onChange={(e) => setSelectedUser(e.target.value)}>
                  <option value="">Select User</option>
                  {
                    users.map((user) =>
                      <option key={user.id} value={user.name}>{user.name}</option>
                    )
                  }
                </select>
                {/*<button*/}
                {/*  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"*/}
                {/*  onClick={handleDeletePermission}*/}
                {/*>*/}
                {/*  DELETE*/}
                {/*</button>*/}
              </div>

              {/*<div className="mt-4">*/}
              {/*  <div>*/}
              {/*    <input*/}
              {/*      type="text"*/}
              {/*      className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"*/}
              {/*      value={permissionName}*/}
              {/*      placeholder="enter a name"*/}
              {/*      onChange={(e) => setPermissionName(e.target.value)}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*  <button*/}
              {/*    type="button"*/}
              {/*    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"*/}
              {/*    onClick={handleCreatePermission}*/}
              {/*  >*/}
              {/*    Create Permission*/}
              {/*  </button>*/}
              {/*</div>*/}

              <hr className="my-4" />

              {/*<div className="flex items-center justify-between">*/}
              {/*  <select*/}
              {/*    className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"*/}
              {/*    onChange={(e) => setPermissionToDelete(e.target.value)}>*/}
              {/*    <option value="">Select Permission</option>*/}
              {/*    {*/}
              {/*      permissions.map((permission, index) =>*/}
              {/*        <option key={index} value={permission}>{permission}</option>*/}
              {/*      )*/}
              {/*    }*/}
              {/*  </select>*/}

              {/*  <button*/}
              {/*    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"*/}
              {/*    onClick={handleDeletePermission}*/}
              {/*  >*/}
              {/*    DELETE*/}
              {/*  </button>*/}
              {/*</div>*/}

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

