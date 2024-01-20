import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton.jsx";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import CategoryEditModal from "../components/CategoryEditModal.jsx";
import CategoryDeleteModal from "../components/CategoryDeleteModal.jsx";
import CategoryCreateModal from "../components/CategoryCreateModal.jsx";

function ManageCategories(){
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, currentUser } = useStateContext();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveNewCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    closeCreateModal();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleDelete = (categoryId) => {
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        showToast('Failed to load categories: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

  const confirmDelete = () => {
    if (categoryToDelete) {
      setLoading(true);
      axiosClient.delete(`/categories/${categoryToDelete}`)
        .then(response => {
          const updatedCategories = categories.filter(category => category.id !== categoryToDelete);
          setCategories(updatedCategories);
          showToast('ManageCategories successfully deleted.');
        })
        .catch(error => {
          showToast(`Error deleting category : ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        });
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return(
    <div className="">
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <table className="">
            <thead className="">
            <tr>
              <th>Title</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody className="h-4 w-4">
            {categories.map((category) => (
              <tr className="m-4 p-4" key={category.id}>
                <td className="m-4 p-4">{category.title}</td>
                <td className="m-4 p-4">
                  <TButton className="m-4 p-4" color="green" onClick={() => handleEdit(category)}>
                    <PencilIcon className="w-4 h-4" />
                  </TButton>
                  <TButton className="m-4 p-4" color="red" onClick={() => handleDelete(category.id)}>
                    <TrashIcon className="w-4 h-4" />
                  </TButton>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          {editingCategory && (
            <CategoryEditModal
              category={editingCategory}
              onSave={(updatedCategory) => {
              setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
              setEditingCategory(null);
              showToast('ManageCategories updated successfully.');
              }}
              onCancel={() => setEditingCategory(null)}
            />
          )}
          {isDeleteModalOpen && (
            <CategoryDeleteModal
              onConfirm={confirmDelete}
              onCancel={closeDeleteModal}
            />
          )}
          <TButton color="indigo" onClick={openCreateModal}>Add New Category</TButton>
          {isCreateModalOpen && (
            <CategoryCreateModal
              onSave={handleSaveNewCategory}
              onCancel={closeCreateModal}
            />
          )}
        </>
      )}
    </div>
  )
}

export default ManageCategories;
