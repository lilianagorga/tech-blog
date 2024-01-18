import React, {useEffect, useState} from "react";
import TButton from "../components/core/TButton.jsx";
import CategoryPostModal from "../components/CategoryPostModal.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import {TrashIcon} from "@heroicons/react/24/outline/index.js";
import PostEditModal from "../components/PostEditModal.jsx";
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

function Post({ post, resetPosts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const { showToast } = useStateContext();

  useEffect(() => {
    axiosClient.get('/posts')
      .then(response => {
        setPosts(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        showToast("Error fetching posts!");
      });
  }, []);

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to remove this post?')) {
      axiosClient.delete(`/posts/${postId}`)
        .then(() => {
          setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
          showToast("Post deleted successfully!");
        })
        .catch((error) => {
          showToast(`Error deleting category : ${error.message}`);
        });
    }
  };

  const updatePost = (updatePost) => {
    setPosts(prevPosts =>
      prevPosts.map(post => post.id === updatePost.id ? updatePost : post)
    );
    showToast("Post updated successfully!");
  };

  function truncateText(text, limit) {
    const wordsArray = text.split(' ');
    if(wordsArray.length > limit) {
      return wordsArray.slice(0, limit).join(' ') + '...';
    }
    return text;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetPosts();
  };

  const handleDelete = () => {
      deletePost(post.id);
  };

  const handleUpdatePost = () => {
    setEditingPost(post);
  };


  const previewText = truncateText(post.body, 2);

  return (
    <li className="border p-2 rounded shadow">
      <h3 className="font-bold">{post.title}</h3>
      <p>{previewText}</p>
      <TButton color="indigo" onClick={handleOpenModal}><EyeIcon className="w-5 h-5 mr-2" />View Posts</TButton>
      {isModalOpen && (
        <CategoryPostModal post={post} onClose={handleCloseModal} />
      )}
      <TButton color="green" onClick={handleUpdatePost}><PencilIcon className="w-4 h-4" /></TButton>
      <TButton color="red" onClick={handleDelete}><TrashIcon className="w-4 h-4" /></TButton>
      {editingPost && (
        <PostEditModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onPostUpdated={handleUpdatePost}
        />
      )}
    </li>
  );
}

export default Post;
