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
  userRoles: getDefaultRoles(),
  userPermissions: getDefaultPermissions(),
  questionTypes: ['text', "select", "radio", "checkbox", "textarea"],
  toast: {
    message: '',
    show: false,
  },
  setCurrentUser: () => {},
  setUserToken: () => {},
  setUserRoles: () => {},
  setUserPermissions: () => {},
  // setCanAccessPanel: () => {},
  showToast: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getDefaultCurrentUser());
  const [userToken, setUserToken] = useState(localStorage.getItem('TOKEN') || '');
  const [userRoles, setUserRoles] = useState(getDefaultRoles());
  const [userPermissions, setUserPermissions] = useState(getDefaultPermissions());
  const [toast, setToast] = useState({ message: '', show: false });
  const [canAccessPanel, setCanAccessPanel] = useState(false);

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

  const handleSetUserRoles = (roles) => {
    if (roles) {
      localStorage.setItem('roles', JSON.stringify(roles));
    } else {
      localStorage.removeItem('roles');
    }
    setUserRoles(roles);
  };

  const handleSetUserPermissions = (permissions) => {
    if (permissions) {
      localStorage.setItem('permissions', JSON.stringify(permissions));
    } else {
      localStorage.removeItem('permissions');
    }
    setUserPermissions(permissions);
    // setCanAccessPanel(permissions.length > 0);
  };

  const showToast = (message) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 5000);
  };

  return (
    <StateContext.Provider value={{
      currentUser, setCurrentUser: handleSetCurrentUser,
      userToken, setUserToken: handleSetUserToken,
      userRoles, setUserRoles: handleSetUserRoles,
      userPermissions, setUserPermissions: handleSetUserPermissions,
      toast, showToast,
      canAccessPanel,
      // canAccessPanel, setCanAccessPanel: handleSetUserPermissions,
      questionTypes: ['text', "select", "radio", "checkbox", "textarea"]
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
