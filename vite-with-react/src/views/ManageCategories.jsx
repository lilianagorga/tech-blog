import React, { useState, useEffect } from "react";
import axiosClient from "../axios.js";
import {useNavigate} from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent.jsx";
import TButton from "../components/core/TButton.jsx";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import CategoryEditModal from "../components/CategoryEditModal.jsx";
import CategoryDeleteModal from "../components/CategoryDeleteModal.jsx";
import CategoryCreateModal from "../components/CategoryCreateModal.jsx";
import {ArrowLeftIcon} from "@heroicons/react/24/outline/index.js";

function ManageCategories(){
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useStateContext();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();


  const goBack = () => {
    navigate(-1);
  }

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = (e) => {
    e.preventDefault();
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
    <PageComponent title="Manage Categories">
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="bg-gray-800 rounded p-4">
          <div className="flex justify-between">
            <TButton onClick={goBack}>
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="ml-1 font-bold">Back</span>
            </TButton>
            <TButton color="indigo" onClick={openCreateModal}>Add New Category</TButton>
          </div>
          <div className="flex flex-col items-center w-full">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="">
              <tr className="text-white">
                <th className="text-center px-6 py-4">Title</th>
                <th className="text-center px-6 py-4">Action</th>
              </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700 text-white">
              {categories.map((category) => (
                <tr className="" key={category.id}>
                  <td className="text-center whitespace-nowrap px-6 py-4">{category.title}</td>
                  <td className="text-center whitespace-nowrap px-6 py-4">
                   <div className="inline-flex justify-end gap-2">
                     <TButton className="m-4 p-4" color="green" onClick={() => handleEdit(category)}>
                       <PencilIcon className="w-4 h-4" />
                     </TButton>
                     <TButton className="m-4 p-4" color="red" onClick={() => handleDelete(category.id)}>
                       <TrashIcon className="w-4 h-4" />
                     </TButton>
                   </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          {editingCategory && (
            <CategoryEditModal
              category={editingCategory}
              onSave={(updatedCategory) => {
              setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
              setEditingCategory(null);
              showToast('ManageCategories updated successfully.');
              }}
              onCancel={(e) =>{
                e.preventDefault(); setEditingCategory(null)}}
            />
          )}
          {isDeleteModalOpen && (
            <CategoryDeleteModal
              onConfirm={confirmDelete}
              onCancel={closeDeleteModal}
            />
          )}

          {isCreateModalOpen && (
            <CategoryCreateModal
              onSave={handleSaveNewCategory}
              onCancel={closeCreateModal}
            />
          )}
        </div>
      )}
    </PageComponent>
  )
}

export default ManageCategories;
