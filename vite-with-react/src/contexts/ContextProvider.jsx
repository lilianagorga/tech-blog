import React, { createContext, useContext, useState } from "react";

const getDefaultCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : {};
  } catch (error) {
    console.error("Error parsing currentUser from localStorage: ", error);
    return {};
  }
};

const getDefaultRoles = () => {
  try {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  } catch (error) {
    console.error("Error parsing roles from localStorage:", error);
    return [];
  }
};

const getDefaultPermissions = () => {
  try {
    const permissions = localStorage.getItem('permissions');
    return permissions ? JSON.parse(permissions) : [];
  } catch (error) {
    console.error("Error parsing permissions from localStorage: ", error);
    return [];
  }
};

const StateContext = createContext({
  currentUser: getDefaultCurrentUser(),
  userToken: localStorage.getItem('TOKEN') || null,
  roles: getDefaultRoles(),
  permissions: getDefaultPermissions(),
  permissionToAdd: {},
  permissionToRevoke: {},
  selectedUser: {},
  userPermissionNames: [],
  roleToAdd: {},
  roleToRevoke: {},
  userRoleNames: [],
  rolesWithAssociatedPermissions: [],
  selectedPermissions: [],
  questionTypes: ['text', "select", "radio", "checkbox", "textarea"],
  toast: {
    message: '',
    show: false,
  },
  setCurrentUser: () => {},
  setUserToken: () => {},
  setRoles: () => {},
  setPermissions: () => {},
  setPermissionToAdd: () => {},
  setPermissionToRevoke: () => {},
  setSelectedUser: () => {},
  setUserPermissionNames: () => {},
  setRoleToRevoke: () => {},
  setRoleToAdd: () => {},
  setUserRoleNames: () => {},
  setRolesWithAssociatedPermissions: () => {},
  setSelectedPermissions: () => {},
  showToast: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getDefaultCurrentUser());
  const [userToken, setUserToken] = useState(localStorage.getItem('TOKEN') || '');
  const [roles, setRoles] = useState(getDefaultRoles());
  const [permissions, setPermissions] = useState(getDefaultPermissions());
  const [toast, setToast] = useState({ message: '', show: false });
  const [permissionToAdd, setPermissionToAdd] = useState({});
  const [permissionToRevoke, setPermissionToRevoke] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [userPermissionNames, setUserPermissionNames] = useState([]);
  const [roleToRevoke, setRoleToRevoke] = useState({});
  const [userRoleNames, setUserRoleNames] = useState([]);
  const [roleToAdd, setRoleToAdd] = useState({});
  const [rolesWithAssociatedPermissions, setRolesWithAssociatedPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const updateRolesWithPermissions = (roleName, newPermissions) => {
    setRolesWithAssociatedPermissions(prevState =>
      prevState.map(role =>
        role.name === roleName ? { ...role, permissions: newPermissions } : role
      )
    );
  };

  const handleSetUserToken = (token) => {
    if (token) {
      localStorage.setItem('TOKEN', token);
    } else {
      localStorage.removeItem('TOKEN');
    }
    setUserToken(token);
  };

  const handleSetCurrentUser = (user) => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    setCurrentUser(user);
  };

  const handleSetRoles = (roles) => {
    if (roles) {
      localStorage.setItem('roles', JSON.stringify(roles));
    } else {
      localStorage.removeItem('roles');
    }
    setRoles(roles);
  };

  const handleSetPermissions = (permissions) => {
    if (permissions) {
      localStorage.setItem('permissions', JSON.stringify(permissions));
    } else {
      localStorage.removeItem('permissions');
    }
    setPermissions(permissions);
  };

  const showToast = (message) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 5000);
  };

  return (
    <StateContext.Provider value={{
      currentUser, setCurrentUser: handleSetCurrentUser,
      userToken, setUserToken: handleSetUserToken,
      roles, setRoles: handleSetRoles,
      permissions, setPermissions: handleSetPermissions,
      permissionToAdd, setPermissionToAdd, permissionToRevoke, setPermissionToRevoke,
      selectedUser, setSelectedUser,
      userPermissionNames, setUserPermissionNames,
      roleToAdd, setRoleToAdd, roleToRevoke, setRoleToRevoke,
      userRoleNames, setUserRoleNames,
      rolesWithAssociatedPermissions, setRolesWithAssociatedPermissions,
      selectedPermissions, setSelectedPermissions,
      toast, showToast, updateRolesWithPermissions,
      questionTypes: ['text', "select", "radio", "checkbox", "textarea"]
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
