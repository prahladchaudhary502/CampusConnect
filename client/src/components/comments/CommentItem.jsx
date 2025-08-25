import { useState } from "react";
import { toast } from "react-hot-toast";

const CommentItem = ({ comment, onReply, onDelete, onUpdate, user }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleReply = () => {
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty!");
      return;
    }
    if (!user && !guestName.trim()) {
      toast.error("Please enter your name to reply.");
      return;
    }

    onReply(replyContent, comment._id, guestName);
    setReplyContent("");
    setGuestName("");
    setShowReply(false);
  };

  const handleUpdate = () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }
    onUpdate(comment._id, {
      content: editContent,
      lastEditedBy: user?.name || guestName || "Guest",
    });
    setShowEdit(false);
  };

  return (
    <div className="p-4 rounded-xl bg-base-100 shadow-sm border border-base-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-gray-800">
            {comment.name}
          </span>
          {comment.lastEditedBy && (
            <span className="text-[11px] text-gray-500 italic">
              Last Edited by {comment.lastEditedBy.email}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Content / Edit box */}
      {showEdit ? (
        <div className="mt-2">
          <textarea
            className="textarea textarea-bordered textarea-sm w-full mb-2"
            rows="2"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="btn btn-xs btn-success"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="btn btn-xs btn-outline"
              onClick={() => {
                setEditContent(comment.content);
                setShowEdit(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed">
          {comment.content}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-3">
        <button
          className="btn btn-xs btn-outline btn-primary"
          onClick={() => setShowReply(!showReply)}
        >
          Reply
        </button>
        <button
          className="btn btn-xs btn-outline btn-warning"
          onClick={() => setShowEdit(!showEdit)}
        >
          Edit
        </button>
        <button
          className="btn btn-xs btn-outline btn-error"
          onClick={() => onDelete(comment._id)}
        >
          Delete
        </button>
        {comment.replies?.length > 0 && (
          <button
            className="btn btn-xs btn-outline"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies
              ? `Hide Replies (${comment.replies.length})`
              : `View Replies (${comment.replies.length})`}
          </button>
        )}
      </div>

      {/* Reply box */}
      {showReply && (
        <div className="mt-3 ml-4 p-3 rounded-lg bg-base-200 border border-base-300">
          {!user && (
            <input
              type="text"
              className="input input-bordered input-sm w-full mb-2"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          )}
          <textarea
            className="textarea textarea-bordered textarea-sm w-full mb-2"
            rows="2"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
          />
          <div className="flex justify-end">
            <button
              className="btn btn-sm btn-primary px-4"
              onClick={handleReply}
            >
              Post Reply
            </button>
          </div>
        </div>
      )}

      {/* Replies accordion */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="mt-4 ml-6 border-l-2 border-base-300 pl-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onUpdate={onUpdate}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
