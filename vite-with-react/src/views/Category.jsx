import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Post from "./Post.jsx";
import PageComponent from "../components/PageComponent.jsx";
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import TButton from "../components/core/TButton.jsx";
import PostEditModal from "../components/PostEditModal.jsx";
import {usePostManager} from "../hooks/usePostManager.jsx";

function Category() {
  const location = useLocation();
  const posts = location.state.posts;
  const category = location.state.category;
  const [availablePosts, setAvailablePosts] = useState([]);
  const navigate = useNavigate();
  const {
    isModalOpen,
    editingPost,
    deletePost,
    handleUpdatePost,
    updatePost,
    handleCloseModal,
  } = usePostManager(setAvailablePosts);

  useEffect(() => {
    setAvailablePosts(posts);
  }, [posts]);

  const goBack = () => {
    navigate(-1);
  }

  return(
    <PageComponent title={category.title}>
      <TButton onClick={goBack}>
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="ml-1 font-bold">Back</span>
      </TButton>
      <div className="grid grid-cols-3 gap-4">
        {availablePosts.length > 0 ? (
          availablePosts.map(post => (
            <div key={post.id} className="col-span-1">
              <Post
                post={post}
                deletePost={deletePost}
                handleUpdatePost={handleUpdatePost}
              />
            </div>
          ))
        ) : (
          <div className="text-gray-800 text-center font-bold uppercase col-span-3 p-6 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">No post yet</div>
        )}
        {editingPost && isModalOpen && (
          <PostEditModal
            post={editingPost}
            onClose={handleCloseModal}
            onPostUpdated={updatePost}
          />
        )}
      </div>
    </PageComponent>
  )
}

export default Category;
