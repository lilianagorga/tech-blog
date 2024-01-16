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

// const getPermissionToAdd = () => {
//   try {
//     const permissionToAdd = localStorage.getItem('permissionToAdd');
//     return permissionToAdd ? JSON.parse(permissionToAdd) : {};
//   } catch (error) {
//     console.error("Error parsing permissionToAdd from localStorage:", error);
//   }
// }
//
// const getPermissionToRevoke = () => {
//   try {
//     const permissionToRevoke = localStorage.getItem('permissionToRevoke');
//     return permissionToRevoke ? JSON.parse(permissionToRevoke) : {};
//   } catch (error) {
//     console.error("Error parsing permissionToRevoke from localStorage:", error);
//   }
// }
//
// const getSelectedUser = () => {
//   try {
//     const selectedUser = localStorage.getItem('selectedUser');
//     return selectedUser ? JSON.parse(selectedUser) : {};
//   } catch (error) {
//     console.error("Error parsing selectedUser from localStorage:", error);
//   }
// }
//
// const getUserPermissionNames = () => {
//   try {
//     const userPermissionNames = localStorage.getItem('userPermissionNames');
//     return userPermissionNames ? JSON.parse(userPermissionNames) : [];
//   } catch (error) {
//     console.error("Error parsing userPermissionNames from localStorage:", error);
//   }
// }

const StateContext = createContext({
  currentUser: getDefaultCurrentUser(),
  userToken: localStorage.getItem('TOKEN') || null,
  roles: getDefaultRoles(),
  permissions: getDefaultPermissions(),
  // permissionToAdd: getPermissionToAdd(),
  // permissionToRevoke: getPermissionToRevoke(),
  // selectedUser: getSelectedUser(),
  // userPermissionNames: getUserPermissionNames(),
  permissionToAdd: {},
  permissionToRevoke: {},
  selectedUser: {},
  userPermissionNames: [],
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

  // const handleSetPermissionToAdd = (permissionToAdd) => {
  //   if (permissionToAdd) {
  //     localStorage.setItem('permissionToAdd', JSON.stringify(permissionToAdd));
  //   } else {
  //     localStorage.removeItem('permissionToAdd');
  //   }
  //   setPermissionToAdd(permissionToAdd);
  // }
  //
  // const handleSetPermissionToRevoke = (permissionToRevoke) => {
  //   if (permissionToRevoke) {
  //     localStorage.setItem('permissionToRevoke', JSON.stringify(permissionToRevoke));
  //   } else {
  //     localStorage.removeItem('permissionToRevoke');
  //   }
  //   setPermissionToRevoke(permissionToRevoke);
  // }
  //
  // const handleSetSelectedUser = (selectedUser) => {
  //   if (selectedUser) {
  //     localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
  //   } else {
  //     localStorage.removeItem('selectedUser');
  //   }
  //   setSelectedUser(selectedUser);
  // }
  //
  // const handleSetUserPermissionNames = (userPermissionNames) => {
  //   if (userPermissionNames) {
  //     localStorage.setItem('userPermissionNames', JSON.stringify(userPermissionNames));
  //   } else {
  //     localStorage.removeItem('userPermissionNames');
  //   }
  //   setUserPermissionNames(userPermissionNames);
  // }

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
      selectedUser, setSelectedUser, userPermissionNames, setUserPermissionNames,
      // permissionToAdd, setPermissionToAdd: handleSetPermissionToAdd,
      // permissionToRevoke, setPermissionToRevoke: handleSetPermissionToRevoke,
      // selectedUser, setSelectedUser: handleSetSelectedUser,
      // userPermissionNames, setUserPermissionNames: handleSetUserPermissionNames,
      toast, showToast,
      questionTypes: ['text', "select", "radio", "checkbox", "textarea"]
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
