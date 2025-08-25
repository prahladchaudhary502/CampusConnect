import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import CommentItem from "./CommentItem";
import buildCommentTree from "./builtCommentTree";
import { toast } from "react-hot-toast";

const CommentSection = ({ targetId, targetType }) => {
  const { user, comments, fetchComments, createComment, createGuestComment, updateComment, deleteComment } =
    useAppContext();
  const [newContent, setNewContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (targetId && targetType) {
      fetchComments(targetId, targetType);
    }
  }, [targetId, targetType]);

  const handleAddComment = async (content = newContent, parentComment = null, name = null) => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const payload = { targetId, targetType, content, parentComment };
    try {
      setLoading(true);

      if (user) {
        await createComment(payload);
      } else {
        const finalName = name || guestName;
        if (!finalName.trim()) {
          toast.error("Please enter your name to post a comment.");
          setLoading(false);
          return;
        }
        await createGuestComment({ ...payload, name: finalName });
      }

      toast.success("Comment posted!");
      setNewContent("");
      if (!parentComment) setGuestName("");
    } catch (err) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };


  const tree = buildCommentTree(comments);
  return (
    <div className="p-6 rounded-xl bg-base-100 shadow-sm">
      <h3 className="text-lg font-bold mb-4 border-b pb-2">Comments</h3>

      {/* Guest name field */}
      {!user && (
        <input
          type="text"
          className="w-full p-2 mb-3 border border-gray-300 rounded outline-none focus:ring focus:ring-primary/30"
          placeholder="Enter your name..."
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      )}

      {/* Comment box */}
      <textarea
        className="w-full p-2 border border-gray-300 rounded outline-none h-28 focus:ring focus:ring-primary/30"
        rows={3}
        placeholder="Write your comment..."
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />

      {/* Post button aligned right */}
      <div className="flex justify-end mt-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleAddComment()}
          className={`bg-primary text-white rounded p-2 px-6 transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* Threaded comment list */}
      <div className="mt-6 space-y-3">
        {tree.length > 0 ? (
          tree.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              onReply={(replyContent, parentComment, name) =>
                handleAddComment(replyContent, parentComment, name)
              }
              onDelete={deleteComment}
              onUpdate={updateComment}
              user={user}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No comments yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
