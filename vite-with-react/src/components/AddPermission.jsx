import React, { useState } from 'react';

function AddPermission({ onSubmit }) {
  const [userId, setUserId] = useState('');
  const [permissionId, setPermissionId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(userId, permissionId);
  };

  return (
    <></>
    // <form onSubmit={handleSubmit}>
    //   <label htmlFor="userId">User ID:</label>
    //   <input
    //     id="userId"
    //     type="text"
    //     value={userId}
    //     onChange={(e) => setUserId(e.target.value)}
    //   />
    //   <label htmlFor="permissionId">Permission ID:</label>
    //   <input
    //     id="permissionId"
    //     type="text"
    //     value={permissionId}
    //     onChange={(e) => setPermissionId(e.target.value)}
    //   />
    //   <button type="submit">Add Permission</button>
    // </form>
  );
}

export default AddPermission;

