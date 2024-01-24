import React from "react";
import TButton from "./core/TButton.jsx";

function CategoryDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content flex items-center gap-2">
        <h3 className="font-bold uppercase text-white">Are you sure you want to delete this category?</h3>
        <TButton className="m-4 p-4 font-bold" onClick={onConfirm}>Yes, Delete</TButton>
        <TButton className="m-4 p-4 font-bold" onClick={onCancel}>No, Cancel</TButton>
      </div>
    </div>
  );
}

export default CategoryDeleteModal;
