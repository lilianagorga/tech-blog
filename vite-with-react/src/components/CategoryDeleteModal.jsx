import React, {useEffect, useRef} from "react";
import TButton from "./core/TButton.jsx";

function CategoryDeleteModal({ onConfirm, onCancel }) {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="modal-content relative p-5 border w-auto shadow-lg rounded-md bg-white" ref={modalRef}>
        <div className="text-center">
          <h3 className="font-bold uppercase mb-4">Are you sure you want to delete this category?</h3>
          <div className="flex justify-around">
            <TButton className="m-4 p-4 font-bold" onClick={onConfirm}>Yes, Delete</TButton>
            <TButton className="m-4 p-4 font-bold" onClick={onCancel}>No, Cancel</TButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryDeleteModal;
