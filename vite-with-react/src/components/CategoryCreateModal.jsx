import React, {useState } from "react";
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { createSlug, createValidateField } from "../utils/utils.jsx";

function CategoryCreateModal({ onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const { showToast } = useStateContext();
  const [errors, setErrors] = useState({});

  const validateField = createValidateField(setErrors);


  const handleTitleCreate = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(createSlug(newTitle));
    validateField('title', newTitle);
  };

  const handleSlugCrete = (e) => {
    const newSlug = e.target.value;
    setSlug(newSlug);
    validateField('slug', newSlug);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(errors).some(errorMsg => errorMsg)) {
      showToast('Please correct the errors before submitting.');
      return;
    }

    const newCategoryData = {
      title,
      slug
    };

    axiosClient.post('/categories', newCategoryData)
      .then(response => {
        onSave(response.data);
        showToast('Category created successfully.');
        setTitle('');
        setSlug('');
      })
      .catch(error => {
        showToast(`Error creating category: ${error.response.data.message}`);
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Category</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleCreate}
          />
          {errors.title && <div className="error">{errors.title}</div>}
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugCrete}
          />
          {errors.slug && <div className="error">{errors.slug}</div>}
          <button type="submit">Create</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default CategoryCreateModal;
