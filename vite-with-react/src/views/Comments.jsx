import React from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import TButton from "../components/core/TButton.jsx";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";

function Comments({ comments, showComments, onDeleteComment, onUpdateComment, handleUpdateComment, editingComment, setEditingComment, editingCommentText, setEditingCommentText }){
  const { currentUser } = useStateContext();
  if (!showComments) return null;

  return(
    <div className="comments-section">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          {editingComment && editingComment.id === comment.id ? (
            <form onSubmit={(e) => handleUpdateComment(e, comment.id)} className="flex items-center gap-2">
              <textarea
                value={editingCommentText}
                onChange={(e) => setEditingCommentText(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                <TButton color="indigo" squareMedium >Update</TButton>
                <TButton color="indigo" squareMedium onClick={(e) =>{
                    e.preventDefault();
                    setEditingComment(null)}}
                >Close
                </TButton>
              </div>
            </form>
          ) : (
            <>
              <div className="comment-content">
                <p className="comment-body">{comment.comment}</p>
                <span className="comment-username">by {comment.user ? comment.user.name : 'Unknown'}</span>
              </div>
              <div className="comment-actions">
                {currentUser && currentUser.id === comment.user_id && (
                  <>
                    <TButton color="green" square onClick={() => onUpdateComment(comment)}>
                      <PencilIcon className="w-4 h-4" />
                    </TButton>
                    <TButton color="red" square onClick={() => onDeleteComment(comment.id)}>
                      <TrashIcon className="w-4 h-4" />
                    </TButton>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Comments;
