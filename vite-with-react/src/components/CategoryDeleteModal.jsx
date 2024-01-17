import React from "react";

function CategoryDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3 className="font-bold uppercase">Are you sure you want to delete this category?</h3>
        <button className="m-4 p-4 font-bold" onClick={onConfirm}>Yes, Delete</button>
        <button className="m-4 p-4 font-bold" onClick={onCancel}>No, Cancel</button>
      </div>
    </div>
  );
}

export default CategoryDeleteModal;
