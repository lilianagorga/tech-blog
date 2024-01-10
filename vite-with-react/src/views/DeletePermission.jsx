import React from "react";
import {useLocation} from "react-router-dom";

function DeletePermission(){
  const location = useLocation();
  const { users } = location.state || { users: [] };
  return (
    <></>
  )
}

export default DeletePermission;
