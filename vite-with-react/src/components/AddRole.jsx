import React, { useState } from 'react';

function AddRole({ onSubmit }) {
  const [roleName, setRoleName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(roleName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="roleName">Role Name:</label>
      <input
        id="roleName"
        type="text"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
      />
      <button type="submit">Add Role</button>
    </form>
  );
}

export default AddRole;
