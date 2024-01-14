import React, { useState } from "react";
import axiosClient from "../axios.js";
import { useNavigate } from "react-router-dom";

function CreatePermission() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/users/permissions', { name });
      console.log("Permission created successfully:", response.data);
    } catch (error) {
      console.error("Error creating permission", error);
    }
  };

  const backToManagePanel = () => {
    navigate('/users/manage-panels');
  }

  return (
    <div>
      <h2>Create New Permission</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Permission Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit">Create Permission</button><br />
        <button type="button" onClick={backToManagePanel}>Back</button>
      </form>
    </div>
  );
}

export default CreatePermission;
