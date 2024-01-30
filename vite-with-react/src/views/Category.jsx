import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Post from "./Post.jsx";
import PageComponent from "../components/PageComponent.jsx";
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import TButton from "../components/core/TButton.jsx";
import PostEditModal from "../components/PostEditModal.jsx";
import {usePostManager} from "../hooks/usePostManager.jsx";
import axiosClient from "../axios.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

function Category() {
  const location = useLocation();
  const posts = location.state.posts;
  const category = location.state.category;
  const { showToast } = useStateContext()
  const [availablePosts, setAvailablePosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalPosts, setOriginalPosts] = useState([]);
  const navigate = useNavigate();
  const {
    isModalOpen,
    editingPost,
    deletePost,
    handleUpdatePost,
    updatePost,
    handleCloseModal,
    updateVoteCount
  } = usePostManager(setAvailablePosts);

  useEffect(() => {
    setOriginalPosts(posts);
    setAvailablePosts(posts);
  }, [posts]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setAvailablePosts(originalPosts);
      return;
    }
    try {
      const response = await axiosClient.get(`/category/${category.slug}?q=${encodeURIComponent(searchQuery)}`);
      setAvailablePosts(response.data.data);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
      showToast('Failed to fetch filtered posts.');
    }
  }

  const handleReset = () => {
    setSearchQuery('');
    setAvailablePosts(originalPosts);
  };

  const goBack = () => {
    navigate(-1);
  }

  return(
    <PageComponent title={category.title}>
        <div className="overflow-y-auto mx-8 py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <TButton onClick={goBack}>
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="ml-1 font-bold">Back</span>
            </TButton>
          </div>

          <div className="shadow-lg rounded-lg p-6 border-4 border-gray-800 my-16 mx-auto max-w-screen-lg">
            <form onSubmit={handleSearch} className="flex gap-4 items-center justify-center">
              <input
                className="rounded mb-2 px-4 py-2 form-element-border"
                style={{ width: 'calc(70% - 1rem)' }}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
              />
              <TButton color="indigo" type="submit" onClick={(e) => {
                e.target.blur();
              }}>Search</TButton>
              <TButton color="red" onClick={(e) => {
                handleReset();
                e.target.blur();
              }}>Reset</TButton>
            </form>
          </div>

          <div className="rounded-lg shadow-xl p-6 border-4 border-gray-800">
            <ul className="text-gray-400 grid grid-cols-3 gap-4 posts-list posts-list:hover">
              {availablePosts.length > 0 ? (
                availablePosts.map(post => (
                  <Post
                    key={post.id}
                    post={post}
                    deletePost={deletePost}
                    handleUpdatePost={handleUpdatePost}
                    updateVoteCount={updateVoteCount}
                  />
                ))
              ) : (
                <div
                  className="text-white text-center font-bold uppercase col-span-3 p-6 max-w-lg mx-auto bg-gray-800 rounded-lg shadow-md">
                  No posts yet
                </div>
              )}
              {editingPost && isModalOpen && (
                <PostEditModal
                  post={editingPost}
                  onClose={handleCloseModal}
                  onPostUpdated={updatePost}
                />
              )}
            </ul>
          </div>
        </div>
    </PageComponent>
  )
}

export default Category;
