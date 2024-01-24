import React, {useState } from "react";
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { createSlug, createValidateField } from "../utils/utils.jsx";
import TButton from "./core/TButton.jsx";

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
        showToast('ManageCategories created successfully.');
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
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <label className="text-white ml-2 font-bold" htmlFor="title">Title</label>
          <input
            className="mb-2"
            type="text"
            id="title"
            value={title}
            onChange={handleTitleCreate}
          />
          {errors.title && <div className="error">{errors.title}</div>}
          <label className="text-white font-bold" htmlFor="slug">Slug</label>
          <input
            className="mb-2"
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugCrete}
          />
          {errors.slug && <div className="error">{errors.slug}</div>}
          <TButton color="indigo" squareMedium>Create</TButton>
          <TButton color="indigo" squareMedium onClick={onCancel}>Cancel</TButton>
        </form>
      </div>
    </div>
  );
}

export default CategoryCreateModal;
