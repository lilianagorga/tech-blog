import {createContext, useContext, useState} from "react";

const StateContext = createContext({
  currentUser: {},
  userToken: null,
  userRoles: [],
  userPermissions: [],
  questionTypes: [],
  toast: {
    message: null,
    show: false,
  },
  setCurrentUser: () => { },
  setUserToken: () => { }
})

const getDefaultPermissions = () => {
  try {
    const permissions = localStorage.getItem('permissions');
    return permissions ? JSON.parse(permissions) : [];
  } catch (error) {
    console.error("Error parsing permissions from localStorage: ", error);
    return [];
  }
};

const getDefaultRoles = () => {
  try {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  } catch (error) {
    console.error("Error parsing roles from localstorage:", error);
    return [];
  }
}

export const ContextProvider = ({ children }) =>{
  const [currentUser, setCurrentUser] = useState({});
  const [userToken, _setUserToken] = useState(localStorage.getItem(('TOKEN') || ''));
  const [userRoles, _setUserRoles] = useState(getDefaultRoles());
  const [userPermissions, _setUserPermissions] = useState(getDefaultPermissions());
  const [questionTypes] = useState(['text', "select", "radio", "checkbox", "textarea"]);
  const [toast, setToast] = useState({message: '', show: false})
  const setUserToken = (token) => {
    if (token) {
      localStorage.setItem('TOKEN', token)
    } else {
      localStorage.removeItem('TOKEN')
    }
    _setUserToken(token);
  }
  const setUserPermissions = (permissions) => {
    if (permissions) {
      localStorage.setItem('permissions', JSON.stringify(permissions));
    } else {
      localStorage.removeItem('permissions')
    }
    _setUserPermissions(permissions)
  }

  const setUserRoles = (roles) => {
    if (roles) {
      localStorage.setItem('roles', JSON.stringify(roles));
    } else {
      localStorage.removeItem('roles')
    }
    _setUserRoles(roles)
  }
  const showToast = (message) => {
    setToast({ message, show: true })
    setTimeout(() => {
      setToast({message: '', show: false})
    }, 5000)
  }
  return (
    <StateContext.Provider value={{
      currentUser, setCurrentUser, userToken, setUserToken, questionTypes, toast,
      showToast, userRoles, setUserRoles, userPermissions, setUserPermissions
    }}>
      {children}
    </StateContext.Provider>
  )
}
export const useStateContext = () => useContext(StateContext)

