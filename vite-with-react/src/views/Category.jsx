import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Post from "./Post.jsx";
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

function Category() {
  const location = useLocation();
  const posts = location.state.posts;
  const category = location.state.category;
  const [availablePosts, setAvailablePosts] = useState([]);
  const { showToast } = useStateContext();

  useEffect(() => {
    setAvailablePosts(posts);
  })

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to remove this post?')) {
      axiosClient.delete(`/posts/${postId}`)
        .then(() => {
          setAvailablePosts(prevPosts => prevPosts.filter(post => post.id !== postId));
          showToast("Post deleted successfully!");
        })
        .catch((error) => {
          showToast(`Error deleting category : ${error.message}`);
        });
    }
  };

  return(
    <>
      <h1>{category.title}</h1>
      {availablePosts.map(post => (
        <Post
          key={post.id}
          post={post}
          deletePost={deletePost}
        />
      ))}
    </>
  )
}

export default Category;
