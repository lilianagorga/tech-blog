import React, { useState, useEffect } from 'react';
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { createSlug, createValidateField } from "../utils/utils.jsx";

function CategoryEditModal({ category, onSave, onCancel }) {
  const [title, setTitle] = useState(category.title || '');
  const [slug, setSlug] = useState(String(category.slug || ''));
  const { showToast } = useStateContext();
  const [errors, setErrors] = useState({});

  const validateField = createValidateField(setErrors);

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
    <div className="modal">
      <div className="modal-content">
        <h2 className="font-bold m-2">Edit Category</h2>
        <form onSubmit={handleSubmit}>
          <label className="font-bold mx-2" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
          {errors.title && <div className="error">{errors.title}</div>}
          <label className="font-bold mx-2" htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
          />
          {errors.title && <div className="error">{errors.slug}</div>}
          <button className="mx-4 font-bold" type="submit">Save Changes</button>
          <button className="font-bold" type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default CategoryEditModal;
