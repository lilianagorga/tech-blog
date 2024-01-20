import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from "../axios.js";
import { getUserPermissions, refreshUserPermissionList, getUserRoles, refreshUserRoleLists } from "../utils/utils.jsx";
import PageComponent from "../components/PageComponent.jsx";
import PermissionsModal from "../components/PermissionsModal.jsx";
import UserPermissionsModal from "../components/UserPermissionsModal.jsx";
import RolesModal from "../components/RolesModal.jsx";
import UserRolesModal from "../components/UserRolesModal.jsx";
import RoleWithAssociatedPermissionsModal from "../components/RoleWithAssociatedPermissionsModal.jsx";
import ManageCategories from "./ManageCategories.jsx";
import TButton from "../components/core/TButton.jsx";
import {Link} from "react-router-dom";

function ManagePanel() {
  const { showToast, permissions, setPermissions, roles, setRoles, permissionToRevoke, permissionToAdd, selectedUser, setSelectedUser, setUserPermissionNames, roleToAdd, roleToRevoke, setUserRoleNames,
    rolesWithAssociatedPermissions, setRolesWithAssociatedPermissions,
    selectedPermissions, setSelectedPermissions
  } = useStateContext();
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownValue, setDropdownValue] = useState('');
  const [permissionName, setPermissionName] = useState('');
  const [permissionToDelete, setPermissionToDelete] = useState('');

  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showUserPermissionsModal, setShowUserPermissionsModal] = useState(false);

  const [roleName, setRoleName] = useState('');
  const [roleToDelete, setRoleToDelete] = useState('');

  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showUserRolesModal, setShowUserRolesModal] = useState(false);

  const [showRoleWithPermissionsModal, setShowRoleWithPermissionsModal] = useState(false);
  const [selectedRoleWithPermissions, setSelectedRoleWithPermissions] = useState(null);

  const handleRolesModalToggle = () => {
    setShowRolesModal(!showRolesModal);
  }

  const handleUserRolesModalToggle = () => {
    setShowUserRolesModal(!showUserRolesModal);
  }

  const handleRoleWithPermissionsModalToggle = () => {
    setShowRoleWithPermissionsModal(!showRoleWithPermissionsModal);
  };

  const handleRoleSelection = (roleName) => {
    const role = rolesWithAssociatedPermissions.find(role => role.name === roleName);
    setSelectedRoleWithPermissions(role);
    setSelectedPermissions(role ? role.permissions.map(permission => permission.name) : []);
  };

  const handleUpdateRolePermissions = async (updatedPermissions) => {
    if (!selectedRoleWithPermissions) {
      showToast('No role selected. Select role to update permissions.', true);
      return;
    }
    try {
      const response = await axiosClient.put('/roles', {
        name: selectedRoleWithPermissions.name,
        permissions: updatedPermissions
      });
      if (response.status === 200) {

        setRolesWithAssociatedPermissions(prevState => prevState.map(role => {
          return role.name === selectedRoleWithPermissions.name ? { ...role, permissions: updatedPermissions } : role;
        }));

        setShowRoleWithPermissionsModal(false);
        showToast('Role permissions have been successfully updated.', false);
        // window.location.reload();
      } else {
        showToast(`Error: ${response.status} ${response.statusText}`, true);
      }
    } catch (error) {
      showToast('An error occurred while updating role permissions.', true);
      console.error('Error while updating role permissions:', error);
    }
  };

  const handlePermissionsModalToggle = () => {
    setShowPermissionsModal(!showPermissionsModal);
  };

  const handleUserPermissionsModalToggle = () => {
    setShowUserPermissionsModal(!showUserPermissionsModal);
  };
  const handleDropdownChange = (e) => setDropdownValue(e.target.value);

  useEffect(() => {
    let isMounted = true;
      const fetchUsersWithRolesAndPermissions = async ()=>{
        try {
          await axiosClient.get('/manage-panels')
            .then(response => {
              const filteredUsers = response.data.users.filter(user=>{
                const userPermissions = getUserPermissions(user);
                const userRoles = getUserRoles(user);

                return userPermissions.length > 0 || userRoles.length > 0;
              });

              setUsers(filteredUsers || []);

              if (JSON.stringify(permissions) !== JSON.stringify(response.data.permissions)) {
                setPermissions(response.data.permissions || []);
              }

              if (JSON.stringify(roles) !== JSON.stringify(response.data.roles)) {
                setRoles(response.data.roles || []);
              }

              setLoading(false);
              setIsAdmin(response.data.isAdmin);
              setRolesWithAssociatedPermissions(response.data.rolesWithAssociatedPermissions);
            });
        } catch (error) {
          if (isMounted) {
            console.error("An error occurred in fetchUsers", error);
            showToast("Error to load data", true);
          }
          setLoading(false);
        }
      };

      fetchUsersWithRolesAndPermissions().catch(error=>{
        console.error("An error occurred in fetchUsers", error);
        showToast("An unexpected error occurred", true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/roles', { name: roleName });
      if (response.status === 201) {
        const updatedRoles = [...roles, roleName];
        setRoles(updatedRoles)
        setShowRolesModal(false);
        setRoleName('');
        console.log("Role created successfully:", response.data);
      }
    } catch (error) {
        console.log("Error creating role", error);
      }
    };

  const handleDeleteRole = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.delete(`/roles/delete?name=${roleToDelete}`);
      if (response.status === 204) {
        setShowRolesModal(false);
        const updatedRoles = roles.filter(role => role !== roleToDelete);
        setRoles(updatedRoles);
        console.log("Role deleted successfully:", response.data);
      }
    } catch (error) {
      console.log("Error deleting role", error);
    }
  }


  const handleCreatePermission = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/permissions', { name: permissionName });
      if (response.status === 201) {
        const updatedPermissions = [...permissions, permissionName];
        setPermissions(updatedPermissions)
        setShowPermissionsModal(false);
        setPermissionName('');
        console.log("Permission created successfully:", response.data);
      }
    } catch (error) {
      console.error("Error creating permission", error);
    }
  };

  const handleDeletePermission = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.delete(`/permissions/delete?name=${permissionToDelete}`);
      if (response.status === 204) {
        setShowPermissionsModal(false);
        const updatedPermissions = permissions.filter(permission => permission !== permissionToDelete);
        setPermissions(updatedPermissions);
        console.log("Permission deleted successfully:", response.data);
      }
    } catch (error) {
      console.error("Error deleting permission", error);
    }
  };

  const handleAssignPermission = async (event) => {
    event.preventDefault();
    if (permissionToAdd && selectedUser) {
      const payload = {
        user_id: selectedUser.id,
        name: permissionToAdd.name
      };
      try {
        const response = await axiosClient.post('/permissions/assign', payload);
        if (response.status === 200) {
          const newUserPermissions = [...selectedUser.permissions, permissionToAdd];
          const updatedUser = { ...selectedUser, permissions: newUserPermissions };
          console.log("selectedUser", selectedUser.permissions);
          setSelectedUser(updatedUser);
          console.log("updatedUser", updatedUser.permissions);
          refreshUserPermissionList(updatedUser, permissions, setUserPermissionNames);
          handleUserPermissionsModalToggle()
          showToast("Permission added successfully");
          window.location.reload();
        } else {
          showToast("Permission not added");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      showToast("Missing permissionToAdd or selectedUser");
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
          refreshUserPermissionList(updatedUser, permissions, setUserPermissionNames);
          handleUserPermissionsModalToggle()
          showToast("Permission revoked successfully");
          // window.location.reload();
        } else {
          showToast("Permission nor revoked");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      showToast("Missing permissionToRevoke or selectedUser");
    }
  };

  const handleAssignRole = async (event) => {
    event.preventDefault();
    if (roleToAdd && selectedUser) {
      const payload = {
        user_id: selectedUser.id,
        name: roleToAdd.name
      };
      try {
        const response = await axiosClient.post('/roles/assign', payload);
        if (response.status === 200) {
          const newUserRoles = [...selectedUser.roles, roleToAdd];
          const updatedUser = { ...selectedUser, roles: newUserRoles };
          console.log("selectedUser", selectedUser.roles);
          setSelectedUser(updatedUser);
          console.log("updatedUser", updatedUser.roles);
          refreshUserRoleLists(updatedUser, roles, setUserRoleNames);
          handleUserRolesModalToggle()
          showToast("Role added successfully");
          window.location.reload();
        } else {
          showToast("Role not added");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      showToast("Missing roleToAdd or selectedUser");
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
          refreshUserRoleLists(updatedUser, roles, setUserRoleNames);
          handleUserRolesModalToggle()
          showToast("Role revoked successfully");
          window.location.reload();
        } else {
          showToast("Role not revoked");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      showToast("Missing roleToRevoke or selectedUser");
    }
  };

  return (
  <PageComponent title="Manage Panel">
    {loading && <div className="flex justify-center">Loading...</div>}
    {!loading && (
      <div className="container mx-auto pt-2 mt-2">
      <div className="grid grid-cols-10 gap-4">
        <aside className='grid col-span-2 grid-row-6 m-4 p-4 bg-gray-800 rounded aria-label="Sidebar"'>

          <Link to="/categories" className="bg-indigo-500 rounded text-white font-bold px-4 py-2 mx-4 block text-center hover:bg-indigo-700">Manage Categories</Link>
          <PermissionsModal
            showModal={showPermissionsModal}
            handleModalToggle={handlePermissionsModalToggle}
            permissionName={permissionName}
            setPermissionName={setPermissionName}
            permissions={permissions}
            setPermissionToDelete={setPermissionToDelete}
            handleCreatePermission={handleCreatePermission}
            handleDeletePermission={handleDeletePermission}
          />

          <UserPermissionsModal
            showModal={showUserPermissionsModal}
            handleModalToggle={handleUserPermissionsModalToggle}
            users={users}
            permissions={permissions}
            handleAssignPermission={handleAssignPermission}
            handleRevokePermission={handleRevokePermission}
          />

          <RolesModal
            showModal={showRolesModal}
            handleModalToggle={handleRolesModalToggle}
            roleName={roleName}
            setRoleName={setRoleName}
            roles={roles}
            setRoleToDelete={setRoleToDelete}
            handleCreateRole={handleCreateRole}
            handleDeleteRole={handleDeleteRole}
          />

          <UserRolesModal
            showModal={showUserRolesModal}
            handleModalToggle={handleUserRolesModalToggle}
            users={users}
            roles={roles}
            handleAssignRole={handleAssignRole}
            handleRevokeRole={handleRevokeRole}
          />

          <RoleWithAssociatedPermissionsModal
            showModal={showRoleWithPermissionsModal}
            handleModalToggle={handleRoleWithPermissionsModalToggle}
            permissions={permissions}
            selectedRole={selectedRoleWithPermissions}
            handleRoleSelection={handleRoleSelection}
            handleUpdateRolePermissions={handleUpdateRolePermissions}
          />

        </aside>
        <main className="col-span-8 p-4 border-l-2 border-r-2">
          <div className="grid grid-cols-4 gap-4 border-b-2">
            <h3 className="col-span-1 text-lg font-bold text-center">Email</h3>
            <h3 className="col-span-2 text-lg font-bold text-center">Permissions</h3>
            <h3 className="col-span-1 text-lg font-bold text-center">Roles</h3>
          </div>
          <div className="grid grid-cols-4 gap-4 py-2">
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                <div className={`col-span-1 p-2`}>
                  {user.email}
                </div>
                <div className={`col-span-2 p-2`}>
                  {getUserPermissions(user).join(', ')}
                </div>
                <div className={`col-span-1 p-2`}>
                  {getUserRoles(user)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </main>
      </div>
      <footer className="mt-4 p-4 bg-gray-200">
        <div className="grid grid-cols-5 m-8 p-8 bg-gray-800 gap-8 rounded">
          {
            rolesWithAssociatedPermissions && rolesWithAssociatedPermissions.map((role, index) => (
              <div className="mt-4 text-white" key={role.id + `${index}`}>
                {role.name}
                <hr/>
                {role.permissions && role.permissions.map((permission, innerIndex) => (
                  <div className=" text-white" key={permission.id + `${innerIndex}`}>{permission.name}</div>
                ))}
              </div>
            ))}
        </div>
      </footer>
    </div>
    )}
  </PageComponent>
);
}

export default ManagePanel;
