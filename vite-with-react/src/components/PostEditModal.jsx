import React, { useState, useEffect } from "react";
import axiosClient from "../axios";
import TButton from "./core/TButton.jsx";
import { createSlug } from "../utils/utils.jsx";

function PostEditModal({ post, onClose, onPostUpdated }) {

  const [editData, setEditData] = useState({
    title: post.title,
    body: post.body,
    slug: post.slug,
    active: post.active
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevEditData) => {
      const newEditData = { ...prevEditData, [name]: value };
      if (name === 'title') {
        newEditData.slug = createSlug(value);
      }
      return newEditData;
    });
  };

  const handleUpdatePost = () =>{
    axiosClient.put(`/posts/${post.id}`, editData)
      .then((response)=>{
        onPostUpdated(response.data);
        onClose();
      })
      .catch((error) =>{
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
        } else {
          console.error('Error updating post:', error.message);
        }
      });
  }
  console.log('editData.title:', editData.title);
  console.log('editData.body:', editData.body);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <input
          type="text"
          name="title"
          value={editData.title}
          onChange={handleInputChange}
        />
        <textarea
          name="body"
          value={editData.body}
          onChange={handleInputChange}
        />
        <TButton color="indigo" onClick={handleUpdatePost}>Update Post</TButton>
        <TButton color="indigo" onClick={onClose}>Close</TButton>
      </div>
    </div>
  );
}

export default PostEditModal;
