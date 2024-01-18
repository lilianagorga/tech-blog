import React from "react";
import TButton from "./core/TButton.jsx";

function CategoryPostModal({ post, onClose }) {
  return (
    <div className="modal-backdrop rounded mt-4">
      <div className="modal-content text-white">
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <TButton color="indigo" onClick={onClose}>Close</TButton>
      </div>
    </div>
  );
}

export default CategoryPostModal;
