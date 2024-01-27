export const getUserPermissions = (user) => {
  const rolePermissions = user.roles
    ? user.roles.flatMap(role => role.permissions ? role.permissions.map(perm => perm.name) : [])
    : [];
  const directPermissions = user.permissions
    ? user.permissions.map(perm => perm.name)
    : [];
  return Array.from(new Set([...rolePermissions, ...directPermissions]));
};

export const refreshUserPermissionList = (user, listOfPermissions, setUserPermissionNames) => {
  const perms = getUserPermissions(user);
  const directPermissions = user.permissions.map(perm => perm.name);
  let updatedPermissions = listOfPermissions.map(permission => {
    return {
      name: permission,
      disabled: perms.includes(permission),
      directRevocable: directPermissions.includes(permission) && perms.includes(permission)
    };
  });

  updatedPermissions.sort((a, b) => {
    if (a.disabled && !b.disabled) return 1;
    if (!a.disabled && b.disabled) return -1;
    return a.name.localeCompare(b.name);
  });

  setUserPermissionNames(updatedPermissions);
}

export   const getUserRoles = (user) => {
  return user.roles.map(role => role.name).join(', ');
};

export   const refreshUserRoleLists = (user, listOfRoles, setUserRoleNames) => {
  const roles = getUserRoles(user);
  let updatedRoles = listOfRoles.map(role => {
    return {
      name: role,
      disabled: roles.includes(role)
    };
  });
  updatedRoles.sort((a, b) => {
    if (a.disabled && !b.disabled) return 1;
    if (!a.disabled && b.disabled) return -1;
    return a.name.localeCompare(b.name);
  });

  setUserRoleNames(updatedRoles);
}

export const createValidateField = (setErrors) => (name, value) => {
  let errorMsg = '';
  if (!value.trim()) {
    errorMsg = `${name[0].toUpperCase() + name.slice(1)} is required.`;
  } else if (value.length > 2048) {
    errorMsg = `${name[0].toUpperCase() + name.slice(1)} must be less than 2048 characters.`;
  }
  setErrors(prevErrors => ({ ...prevErrors, [name]: errorMsg }));
};

export const createSlug = (title) => {
  return title
    .toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
};

