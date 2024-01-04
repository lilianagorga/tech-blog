import React from 'react';

function Users({ users, onAddPermission }) {
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [permissionIdToAdd, setPermissionIdToAdd] = React.useState('');

  const handlePermissionChange = (e) => {
    setPermissionIdToAdd(e.target.value);
  };

  const handleAddPermissionClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleSubmitPermission = (e) => {
    e.preventDefault();
    onAddPermission(selectedUserId, permissionIdToAdd);
    setPermissionIdToAdd('');
  };

  return (
    <div>
      <h3>Users</h3>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Add Permission</th>
        </tr>
        </thead>
        <tbody>
        {Object.values(users).map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <button onClick={() => handleAddPermissionClick(user.id)}>
                Add Permission
              </button>
              {selectedUserId === user.id && (
                <form onSubmit={handleSubmitPermission}>
                  <input
                    type="text"
                    placeholder="Permission ID"
                    value={permissionIdToAdd}
                    onChange={handlePermissionChange}
                  />
                  <button type="submit">Submit</button>
                </form>
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
