import React, { useState, useEffect, useRef } from 'react';
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { createSlug, createValidateField } from "../utils/utils.jsx";
import TButton from "./core/TButton.jsx";

function CategoryEditModal({ category, onSave, onCancel }) {
  const [title, setTitle] = useState(category.title || '');
  const [slug, setSlug] = useState(String(category.slug || ''));
  const { showToast } = useStateContext();
  const [errors, setErrors] = useState({});
  const modalRef = useRef();
  const validateField = createValidateField(setErrors);

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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleTitleChange = (e) => {
    const { value } = e.target;
    setTitle(value);
    const generatedSlug = createSlug(value);
    setSlug(generatedSlug);
    validateField('title', value);
  };


  const handleSlugChange = (e) => {
    const { value } = e.target;
    setSlug(value);
    validateField('slug', value);
  };

  useEffect(() => {
    setTitle(category.title);
    setSlug(category.slug);
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let localErrors = {};

    validateField('title', title);
    if (!title.trim() || title.length > 2048) {
      localErrors.title = errors.title;
    }

    validateField('slug', slug);
    if (!slug.trim() || slug.length > 2048) {
      localErrors.slug = errors.slug;
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      showToast(Object.values(localErrors).join(' '));
      return;
    }


    const updatedCategoryData = { title, slug };

    axiosClient.put(`/categories/${category.id}`, updatedCategoryData)
      .then(response => {
        onSave(response.data);
        showToast('ManageCategories updated successfully!');
      })
      .catch(error => {
        console.error('Failed to update category:', error);
        showToast('Error updating category.');
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="modal-content relative p-5 border w-auto shadow-lg rounded-md bg-white" ref={modalRef}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
            />
            {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">Slug</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="slug"
              value={slug}
              onChange={handleSlugChange}
            />
            {errors.title && <p className="text-red-500 text-xs italic">{errors.slug}</p>}
          </div>
          <div className="flex items-center justify-between">
            <TButton color="indigo" squareMedium >Save Changes</TButton>
            <TButton color="indigo" squareMedium onClick={onCancel}>Cancel</TButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryEditModal;
