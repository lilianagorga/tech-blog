import React, {useState, useRef, useEffect} from "react";
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
        onCancel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);


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
              onChange={handleTitleCreate}
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
              onChange={handleSlugCrete}
            />
            {errors.slug && <p className="text-red-500 text-xs italic">{errors.slug}</p>}
          </div>
          <div className="flex items-center justify-between">
            <TButton color="indigo" squareMedium>Create</TButton>
            <TButton color="indigo" squareMedium onClick={onCancel}>Cancel</TButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryCreateModal;
