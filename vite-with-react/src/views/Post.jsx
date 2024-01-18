import React, { useState } from "react";
import TButton from "../components/core/TButton.jsx";
import PostModal from "../components/PostModal.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

function Post({ post, resetPosts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetPosts();
  };

  return (
    <li className="border p-2 rounded shadow">
      <h3 className="font-bold">{post.title}</h3>
      <TButton color="indigo" onClick={handleOpenModal}><EyeIcon className="w-5 h-5 mr-2" />View Posts</TButton>
      {isModalOpen && (
        <PostModal post={post} onClose={handleCloseModal} />
      )}
    </li>
  );
}

export default Post;
