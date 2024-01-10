import React, { useEffect } from "react";
import axiosClient from "../axios.js";
import {useLocation} from "react-router-dom";

function DeleteRole(){
  const location = useLocation();
  const { users } = location.state || { users: [] };
  const deleteRole = async () => {
    try {
      const response = await axiosClient.delete('/users/roles/delete', {
        data: {
          user_id: userId,
          role: roleName
        }
      });
      // Gestire la risposta...
    } catch (error) {
      // Gestire l'errore...
    }
  };

  useEffect(() => {
    deleteRole();
  }, []);
  return (
    <></>
  )
}

export default DeleteRole;
