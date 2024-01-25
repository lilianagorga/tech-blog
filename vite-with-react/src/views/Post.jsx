import React, {useEffect, useState} from "react";
import TButton from "../components/core/TButton.jsx";
import {EyeIcon, PencilIcon, HandThumbDownIcon, HandThumbUpIcon} from "@heroicons/react/24/outline";
import {TrashIcon} from "@heroicons/react/24/outline/index.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios.js";
import Comments from "./Comments.jsx";

function Post({ post, deletePost, handleUpdatePost, updateVoteCount }) {
  const { currentUser, showToast } = useStateContext();
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [currentVote, setCurrentVote] = useState(null);

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

  useEffect(() => {
    axiosClient.get(`/posts/${post.id}/comments`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
        showToast("Error fetching comments!");
      });
  }, [post.id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const payload = {
      comment: newCommentText,
      post_id: post.id,
    };

    axiosClient.post('/comments', payload)
      .then(response => {
        setComments([...comments, {...response.data, user: currentUser}]);
        setNewCommentText("");
        showToast("Comments added successfully!");
      })
      .catch(error => {
        if (error.response) {
          console.error('Validation error data:', error.response.data);
        } else {
          console.error('Error adding comment:', error);
        }
        showToast("Error adding comment!");
      });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to remove this comment?')) {
      axiosClient.delete(`/comments/${commentId}`)
        .then(response => {
          setComments(currentComments => currentComments.filter(comment => comment.id !== commentId));
          showToast(response.data.message);
        })
        .catch(error => {
          if (error.response) {
            console.error('Validation error data:', error.response.data);
          } else {
            console.error('Error deleting comment:', error);
          }
          showToast("Error deleting comment!");
        });
    }
  };

  const updateComment = (comment) => {
    setEditingComment(comment);
    setEditingCommentText(comment.comment);
  };

  const handleUpdateComment = (e, commentId) => {
    e.preventDefault();
    const payload = {
      comment: editingCommentText,
      post_id: post.id,
    };
    axiosClient.patch(`/comments/${commentId}`, payload)
      .then(response => {
        setComments(currentComments =>
          currentComments.map((comment) =>
            comment.id === commentId ? { ...comment, comment: editingCommentText } : comment
          )
        );
        setEditingComment(null);
        setEditingCommentText("");
        showToast("Comment updated successfully!");
      })
      .catch(error => {
        if (error.response) {
          console.error('Validation error data:', error.response.data);
        } else {
          console.error('Error updating comment:', error);
        }
        showToast("Error updating comment!");
      });
  };

  const previewText = isOpen ? post.body : truncateText(post.body, 10);

  const handleVote = (type) => {
    if (!currentUser) {
      showToast("You must be logged in and have a verified email to vote.");
      return;
    }

    const payload = {
      post_id: post.id,
      type: type,
    };

    let voteMethod, voteUrl;
    if (currentVote && currentVote.type !== type) {
      voteMethod = 'patch';
      voteUrl = `/votes/${currentVote.id}`;
    } else {
      voteMethod = 'post';
      voteUrl = `/votes/${type}`;
    }

    axiosClient[voteMethod](voteUrl, payload)
      .then(response => {
        console.log('Response data:', response.data);
        setCurrentVote( response.data.vote);
        console.log('currentVote in handleVote:',currentVote)
        updateVoteCount(post.id, {
          upVote_count: parseInt(response.data.upVote_count),
          downVote_count: parseInt(response.data.downVote_count),
        });
        showToast("Vote updated!");
      })
      .catch(error => {
        console.error('Error voting:', error.response?.data || error);
        showToast(error.response?.data?.message || "Error registering vote!");
      });
  };

  const handleDeleteVote = () => {
    if (!currentUser || !currentVote) {
      showToast("You must be logged in to delete a vote.");
      return;
    }

    axiosClient.delete(`/votes/${currentVote.id}`)
      .then(() => {
        setCurrentVote(null);
        console.log('currentVote in handleDeleteVote:',currentVote);
        updateVoteCount(post.id, {
          upVote_count: currentVote.type === 'up' ? post.upVote_count - 1 : post.upVote_count,
          downVote_count: currentVote.type === 'down' ? post.downVote_count - 1 : post.downVote_count,
        });
        showToast("Vote deleted successfully!");
      })
      .catch(error => {
        console.error('Error deleting vote:', error.response?.data || error);
        showToast(error.response?.data?.message || "Error deleting vote!");
      });
  };
  //
  // useEffect(() => {
  //   console.log('currentVote has changed:', currentVote);
  // }, [currentVote]);

  return (
    <li className="relative border p-2 rounded-lg shadow-lg h-full flex flex-col">
      <div className="absolute top-0 right-0 m-2 flex gap-2">
        {canUpdate && (
          <TButton color="green" square  onClick={() => handleUpdatePost(post)}><PencilIcon className="w-4 h-4" /></TButton>
        )}
        {canDelete && (
          <TButton color="red" square onClick={handleDelete}><TrashIcon className="w-4 h-4" /></TButton>
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
     <div className="flex justify-between">
       {!isOpen && (
         <TButton color="indigo" onClick={handleOpen}><EyeIcon className="w-5 h-5" />View Post</TButton>
       )}
       {isOpen && (
         <TButton onClick={handleClose} color="indigo">Close</TButton>
       )}
       <TButton onClick={toggleComments}>
         {showComments ? "Hide Comments" : "View Comments"} ({comments.length})
       </TButton>

     </div>
      <Comments
        comments={comments}
        showComments={showComments}
        onDeleteComment={handleDeleteComment}
        onUpdateComment={updateComment}
        handleUpdateComment={handleUpdateComment}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        editingCommentText={editingCommentText}
        setEditingCommentText={setEditingCommentText}
      />
      <form onSubmit={handleAddComment} className="comment-form flex items-center gap-2">
        <textarea
          className="flex-1 comment-textarea"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Leave a comment..."
          rows="1"
        />
        <TButton color="green" squareMedium >Send</TButton>
      </form>
      <div className="flex items-center gap-2">
        <TButton onClick={() => handleVote('up')} color="indigo" squareMedium>
          <HandThumbUpIcon className="h-4 w-4" />{post.upVote_count}
        </TButton>
        <TButton onClick={() => handleVote('down')} color="indigo" squareMedium>
          <HandThumbDownIcon className="w-4 h-4" />{post.downVote_count}
        </TButton>
        {currentVote && (
          <TButton onClick={handleDeleteVote} color="red" squareMedium>Delete Vote
            {/*<TrashIcon className="w-4 h-4" />*/}
          </TButton>
        )}
      </div>
    </li>
  );
}

export default Post;
