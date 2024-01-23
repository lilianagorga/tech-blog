import React, { useState} from "react";
import TButton from "../components/core/TButton.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import {TrashIcon} from "@heroicons/react/24/outline/index.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import PostEditModal from "../components/PostEditModal.jsx";

function Post({ post, deletePost, handleUpdatePost }) {
  const { currentUser } = useStateContext();
  const [isOpen, setIsOpen] = useState(false);

  const hasRequiredRoleOrPermission = () => {
    const roles = ['Admin', 'Moderator'];
    const hasRole = currentUser.roles.some(role => roles.includes(role.name));
    const hasPermission = currentUser.permissions.some(permission => permission.name === 'managePosts');
    const isOwner = currentUser.id === post.user_id;
    return hasRole || hasPermission || isOwner;
  };

  const canDelete = hasRequiredRoleOrPermission();
  const canUpdate = hasRequiredRoleOrPermission();

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

  const previewText = isOpen ? post.body : truncateText(post.body, 10);

  return (
    <li className="relative border p-2 rounded-lg shadow-lg h-full flex flex-col">
      <div className="absolute top-0 right-0 m-2 flex gap-2">
        {canDelete && (
          <TButton color="red" square onClick={handleDelete}><TrashIcon className="w-4 h-4" /></TButton>
        )}
        {canUpdate && (
          <TButton color="green" square  onClick={() => handleUpdatePost(post)}><PencilIcon className="w-4 h-4" /></TButton>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold">{post.title}</h3>
        <div className="flex flex-wrap">
          {post.categories && post.categories.length > 0 ? (
            post.categories.map((category) => (
              <h6 key={category.id} className="text-xs mr-2">{category.title}</h6>
            ))
          ) : (
            <h6 className="text-xs truncate">No categories</h6>
          )}
        </div>
      </div>
      <p className="text-xs overflow-hidden text-ellipsis">{previewText}</p>
     <div className="flex justify-start">
       {!isOpen && (
         <TButton color="indigo" onClick={handleOpen}><EyeIcon className="w-5 h-5" />View</TButton>
       )}
       {isOpen && (
         <TButton onClick={handleClose} color="indigo">Close</TButton>
       )}
     </div>
    </li>
  );
}

export default Post;
