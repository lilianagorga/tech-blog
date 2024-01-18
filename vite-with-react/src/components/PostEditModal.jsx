import React, { useState, useEffect } from "react";
import axiosClient from "../axios";
import TButton from "./core/TButton.jsx";

function PostEditModal({ post, onClose, onPostUpdated }) {
  const [editData, setEditData] = useState({
    title: post.title,
    body: post.body,
  });

  useEffect(() => {
    setEditData({
      title: post.title,
      body: post.body,
    });
  }, [post]);

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdatePost = () => {
    axiosClient.put(`/posts/${post.id}`, editData)
      .then((response) => {
        onPostUpdated(response.data);
        onClose();
      })
      .catch((error) => {
        console.error('Error updating post:', error);
      });
  };

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
