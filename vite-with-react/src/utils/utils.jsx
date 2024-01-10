export const getUserPermissions = (user) => {
  const rolePermissions = user.roles
    ? user.roles.flatMap(role => role.permissions ? role.permissions.map(perm => perm.name) : [])
    : [];
  const directPermissions = user.permissions
    ? user.permissions.map(perm => perm.name)
    : [];
  return Array.from(new Set([...rolePermissions, ...directPermissions]));
};
