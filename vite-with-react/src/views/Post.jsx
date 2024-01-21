import React, { useState} from "react";
import TButton from "../components/core/TButton.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import {TrashIcon} from "@heroicons/react/24/outline/index.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import PostEditModal from "../components/PostEditModal.jsx";

function Post({ post, deletePost, updatePost }) {
  const { currentUser } = useStateContext();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const hasRequiredRoleOrPermission = () => {
    const roles = ['Admin', 'Moderator'];
    const hasRole = currentUser.roles.some(role => roles.includes(role.name));
    const hasPermission = currentUser.permissions.some(permission => permission.name === 'managePosts');
    const isOwner = currentUser.id === post.user_id;
    return hasRole || hasPermission || isOwner;
  };

  const canDelete = hasRequiredRoleOrPermission();

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

  const handleDelete = () => {
      deletePost(post.id);
  };
  //
  // const handleUpdatePost = () => {
  //   setEditingPost(post);
  //
  // };


  const previewText = isOpen ? post.body : truncateText(post.body, 2);

  return (
    <li className="border p-2 rounded shadow">
      <h3 className="font-bold">{post.title}</h3>
      {post.categories && post.categories.map((category) => (
        <h6 key={category.id}>{category.title}</h6>
      ))}
      <p>{previewText}</p>
      {!isOpen && (
        <TButton color="indigo" onClick={handleOpen}><EyeIcon className="w-5 h-5" />View</TButton>
      )}
      {isOpen && (
        <TButton onClick={handleClose} color="indigo">Close</TButton>
      )}
      {canDelete && (
        <TButton color="red" onClick={handleDelete}><TrashIcon className="w-4 h-4" /></TButton>
      )}
      {/*<TButton color="green" onClick={handleUpdatePost}><PencilIcon className="w-4 h-4" /></TButton>*/}

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
