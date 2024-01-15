// import React, { useEffect, useRef, useState } from 'react';
// import { getUserPermissions } from "../utils/utils.jsx";
// import axiosClient from "../axios.js";
//
// function UserPermissionsModal({
//                             showModal,
//                             handleModalToggle,
//                             users,
//                             permissions,
//                           }) {
//
//   const [permissionToAdd, setPermissionToAdd] = useState({});
//   const [selectedUser, setSelectedUser] = useState({});
//
//   const [userPermissionNames, setUserPermissionNames] = useState([]);
//
//   const modalRef = useRef();
//
//   const buildAddablePermissions = (user, listOfPermissions, permissionAdded = {}, perms2 = false) => {
//     const perms = getUserPermissions(user);
//     let updatedPermissions = [];
//
//     if (user && listOfPermissions.length > 0) {
//       if (typeof listOfPermissions[0] === 'string') {
//         updatedPermissions = listOfPermissions.map(permission => {
//           return {
//             name: permission,
//             disabled: perms.includes(permission)
//           };
//         });
//       } else {
//         if (permissionAdded) {
//           const updatedPermissionsForUser = selectedUser.permissions.filter(
//             permission => permission.id !== permissionAdded.id
//           )
//
//           setSelectedUser({
//             ...selectedUser,
//             permissions: updatedPermissionsForUser
//           })
//         }
//         updatedPermissions = userPermissionNames.map(permission => {
//           return {
//             name: permission.name,
//             disabled: permissionToAdd.name === permission.name
//           };
//         });
//       }
//       setUserPermissionNames(updatedPermissions);
//     } else {
//       setUserPermissionNames([]);
//     }
//
//     if (perms2) {
//       console.log("got here")
//       console.log("perms 222", perms);
//     }
//
//     console.log("perms", perms);
//   }
//
//   const handleClickOutsidePermissionsModal = (event) => {
//     if (modalRef.current && !modalRef.current.contains(event.target)) {
//       handleModalToggle();
//     }
//   };
//
//   const handleAssignPermission = async(event) => {
//     event.preventDefault();
//
//     if (permissionToAdd && selectedUser) {
//       const payload = {
//         user_id: selectedUser.id,
//         name: permissionToAdd.name
//       }
//
//       try {
//         const response = await axiosClient.post('/users/permissions/add', payload);
//
//         if (response.status === 200) {
//           handleModalToggle();
//           buildAddablePermissions(selectedUser, userPermissionNames, permissionToAdd, true);
//           console.log("Permission added successfully");
//         } else {
//           console.log("permission not added");
//         }
//       } catch (error) {
//         console.error("Response", error);
//       }
//     } else {
//       console.log("Missing permissionToAdd or selectedUser");
//     }
//   }
//
//   useEffect(() => {
//     if (showModal) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('mousedown', handleClickOutsidePermissionsModal);
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//
//     return () => window.removeEventListener('mousedown', handleClickOutsidePermissionsModal);
//   }, [showModal]);
//
//   return (
//     <div className="p-4">
//       <button
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         onClick={handleModalToggle}>
//         User Permissions
//       </button>
//
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//           <div
//             className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
//             ref={modalRef}
//           >
//             <div className="mt-3 text-center">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">User Permissions Panel</h3>
//
//               <div className="flex items-center justify-between">
//                 <label htmlFor="userSelect">Select User:</label>
//                 <select
//                   id="userSelect"
//                   className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"
//                   onChange={(e) => {
//                     const selectedUserName = e.target.value;
//                     const selectedUserObject = users.find(user => user.name === selectedUserName);
//                     setSelectedUser(selectedUserObject);
//                     buildAddablePermissions(selectedUserObject, permissions);
//                   }}>
//                   <option value="">Select User</option>
//                   {
//                     users && users.map((user) =>
//                       <option key={user.id} value={user.name}>{user.name}</option>
//                     )
//                   }
//                 </select>
//               </div>
//
//               <div className="mt-4">
//                 <div>
//                   <label htmlFor="permissionSelect">Select Permission:</label>
//                   <select
//                     id="permissionSelect"
//                     onChange={(e) => {
//                       const selectedPermission = userPermissionNames.find(permission => permission.name === e.target.value);
//                       setPermissionToAdd(selectedPermission || {});
//                     }}
//                   >
//                     <option value="">Select Permission</option>
//                     {userPermissionNames.map((permission, index) => (
//                       <option
//                         key={index}
//                         value={permission.name}
//                         disabled={permission.disabled}
//                       >
//                         {permission.name}
//                       </option>
//                     ))}
//                   </select>
//
//                     <button
//                       className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                       onClick={handleAssignPermission}
//                     >
//                       Assign
//                     </button>
//                 </div>
//               </div>
//
//               <hr className="my-4" />
//
//               <div className="mt-4">
//                 <button
//                   className="bg-red-500 text-white font-bold py-2 px-4 rounded w-full"
//                   onClick={handleModalToggle}>
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//
// export default UserPermissionsModal;

import React, { useEffect, useRef, useState } from 'react';
import { getUserPermissions } from "../utils/utils.jsx";
import axiosClient from "../axios.js";

function UserPermissionsModal({ showModal, handleModalToggle, users, permissions }) {
  const [permissionToAdd, setPermissionToAdd] = useState({});
  const [permissionToRevoke, setPermissionToRevoke] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [userPermissionNames, setUserPermissionNames] = useState([]);

  const modalRef = useRef();

  const buildAddablePermissions = (user, listOfPermissions) => {
    const perms = getUserPermissions(user);
    let updatedPermissions = listOfPermissions.map(permission => {
      return {
        name: permission,
        disabled: perms.includes(permission)
      };
    });

    updatedPermissions.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return a.name.localeCompare(b.name);
    });

    setUserPermissionNames(updatedPermissions);
  }

  useEffect(() => {

  }, [selectedUser, userPermissionNames]);


    const handleAssignPermission = async (event) => {
    event.preventDefault();
    if (permissionToAdd && selectedUser) {
      const payload = {
        user_id: selectedUser.id,
        name: permissionToAdd.name
      };
      try {
        const response = await axiosClient.post('/permissions/add', payload);
        if (response.status === 200) {
          const newUserPermissions = [...selectedUser.permissions, permissionToAdd];
          const updatedUser = { ...selectedUser, permissions: newUserPermissions };
          console.log("selectedUser", selectedUser.permissions);
          setSelectedUser(updatedUser);
          console.log("updatedUser", updatedUser.permissions);
          // setTimeout(() => {
          //   buildAddablePermissions(updatedUser, permissions);
          // }, 3000);
          buildAddablePermissions(updatedUser, permissions);
          handleModalToggle()
          console.log("Permission added successfully");
        } else {
          console.log("Permission not added");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      console.log("Missing permissionToAdd or selectedUser");
    }
  };

  const handleRevokePermission = async (e) => {
    e.preventDefault();
    if (permissionToRevoke && selectedUser) {
      const payload = {
        user_id: selectedUser.id,
        name: permissionToRevoke.name
      };
      try {
        const response = await axiosClient.post('/permissions/revoke', payload);
        if (response.status === 200) {
          const revokedUserPermissions = [...selectedUser.permissions, permissionToRevoke];
          const updatedUser = { ...selectedUser, permissions: revokedUserPermissions };
          console.log("selectedUser", selectedUser.permissions);
          setSelectedUser(updatedUser);
          console.log("updatedUser", updatedUser.permissions);
          buildAddablePermissions(updatedUser, permissions);
          handleModalToggle()
          console.log("Permission revoked successfully");
        } else {
          console.log("Permission nor revoked");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      console.log("Missing permissionToRevoke or selectedUser");
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
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
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
                    buildAddablePermissions(selectedUserObject, permissions);
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
                        disabled={permission.disabled}
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
                        disabled={!permission.disabled}
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



{/*<button*/}
{/*  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"*/}
{/*  onClick={handleDeletePermission}*/}
{/*>*/}
{/*  DELETE*/}
{/*</button>*/}

{/*// value={selectedPermissions}*/}
{/*// onChange={(e) => setSelectedPermissions(e.target.value)}*/}

{/*  <input*/}
{/*    type="text"*/}
{/*    className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 mr-2"*/}
{/*    value={permissionName}*/}
{/*    placeholder="enter a name"*/}
{/*    onChange={(e) => setPermissionName(e.target.value)}*/}
{/*  />*/}
{/*<button*/}
{/*  type="button"*/}
{/*  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"*/}
{/*  onClick={handleCreatePermission}*/}
{/*>*/}
{/*  Create Permission*/}
{/*</button>*/}

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

// permissionName,
// setPermissionName,
// setPermissionToDelete,
// handleCreatePermission,
// handleDeletePermission,
