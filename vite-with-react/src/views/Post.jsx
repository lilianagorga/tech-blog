import React, {useEffect, useState} from "react";
import TButton from "../components/core/TButton.jsx";
import CategoryPostModal from "../components/CategoryPostModal.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import {TrashIcon} from "@heroicons/react/24/outline/index.js";
import PostEditModal from "../components/PostEditModal.jsx";
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

function Post({ post, isFilteredPost, resetPosts, deletePost, updatePost }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  function truncateText(text, limit) {
    const wordsArray = text.split(' ');
    if(wordsArray.length > limit) {
      return wordsArray.slice(0, limit).join(' ') + '...';
    }
    return text;
  }

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleResetAndClose = () => {
    setIsOpen(false);
    resetPosts();
  }

  // const handleDelete = () => {
  //     deletePost(post.id);
  // };
  //
  // const handleUpdatePost = () => {
  //   setEditingPost(post);
  //
  // };


  const previewText = isOpen ? post.body : truncateText(post.body, 2);

  return (
    <li className="border p-2 rounded shadow">
      <h3 className="font-bold">{post.title}</h3>
      <p>{previewText}</p>
      {!isOpen && (
        <TButton color="indigo" onClick={handleOpen}><EyeIcon className="w-5 h-5 mr-2" />View Post</TButton>
      )}
      {isOpen && (
        isFilteredPost
          ? <TButton onClick={handleResetAndClose} color="indigo">Close</TButton>
          : <TButton onClick={handleClose} color="indigo">Close</TButton>
      )}

      {/*<TButton color="green" onClick={handleUpdatePost}><PencilIcon className="w-4 h-4" /></TButton>*/}
      {/*<TButton color="red" onClick={handleDelete}><TrashIcon className="w-4 h-4" /></TButton>*/}
      {/*{editingPost && (*/}
      {/*  <PostEditModal*/}
      {/*    post={editingPost}*/}
      {/*    onClose={() => setEditingPost(null)}*/}
      {/*    onPostUpdated={updatePost}*/}
      {/*  />*/}
      {/*)}*/}
    </li>
  );
}

export default Post;
