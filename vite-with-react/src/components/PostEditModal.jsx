import React, {useState, useRef, useEffect} from "react";
import axiosClient from "../axios";
import TButton from "./core/TButton.jsx";
import { createSlug } from "../utils/utils.jsx";

function PostEditModal({ post, onClose, onPostUpdated }) {

  const [editData, setEditData] = useState({
    title: post.title,
    body: post.body,
    slug: post.slug,
    active: post.active,
    categories: post.categories.map(cat => cat.id)
  });

  useEffect(() => {
    setEditData({
      title: post.title,
      body: post.body,
      slug: post.slug,
      active: post.active,
      categories: post.categories.map(cat => cat.id)
    });
  }, [post]);

  const modalRef = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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

  return (
    <div className="modal-backdrop fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="modal-content relative p-5 border w-auto shadow-lg rounded-md bg-white" ref={modalRef}>
        <div className="mb-4">
          <input
            className="w-full p-2 border rounded"
            type="text"
            name="title"
            placeholder="title"
            value={editData.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            name="body"
            placeholder="..."
            rows="4"
            value={editData.body}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-between space-x-4">
          <TButton color="indigo" onClick={handleUpdatePost}>Update Post</TButton>
          <TButton color="indigo" onClick={onClose}>Close</TButton>
        </div>
      </div>
    </div>
  );
}

export default PostEditModal;
