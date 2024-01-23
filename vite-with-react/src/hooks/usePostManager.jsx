import { useState, useCallback } from 'react';
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";

export function usePostManager(updatePostCallback) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const { showToast } = useStateContext();

  const deletePost = useCallback((postId) => {
    if (window.confirm('Are you sure you want to remove this post?')) {
      axiosClient.delete(`/posts/${postId}`)
        .then(() => {
          updatePostCallback(prevPosts => prevPosts.filter(post => post.id !== postId));
          showToast("Post deleted successfully!");
        })
        .catch((error) => {
          showToast(`Error deleting post: ${error.message}`);
        });
    }
  }, [showToast, updatePostCallback]);

  const handleUpdatePost = useCallback((post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  }, []);

  const updatePost = useCallback((updatedPost) => {
    updatePostCallback(prevPosts =>
      prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
    showToast("Post updated successfully!");
  }, [showToast, updatePostCallback]);

  const handleCloseModal = useCallback(() => {
    setEditingPost(null);
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    editingPost,
    deletePost,
    handleUpdatePost,
    updatePost,
    handleCloseModal
  };
}
