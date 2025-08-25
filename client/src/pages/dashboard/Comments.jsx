import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import NoticeModal from "../NoticeModal";

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const Comments = () => {
  const { user, fetchComments, fetchCommentsForCreator, updateComment, deleteComment } = useAppContext();

  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");

  const [openNotice, setOpenNotice] = useState(false);
  const [noticeId, setNoticeId] = useState(null);

  const loadComments = async (pageNo = 1) => {
    const res = (user.role === "admin") ? (await fetchComments(null, null, pageNo, 5))
      : (await fetchCommentsForCreator(pageNo, 5));
      console.log(res);
    setComments(res.comments);
    setPage(res.pagination?.page || 1);
    setPages(res.pagination?.pages || 1);
  };

  useEffect(() => {
    loadComments(1);
  }, []);

  const handleEdit = (comment) => {
    setEditing(comment._id);
    setEditText(comment.content);
    setExpanded(comment._id);
  };

  const handleSave = async (id) => {
    await updateComment(id, { content: editText });
    setEditing(null);
    setEditText("");
    loadComments(page); // refresh current page
  };

  const handleNoticeClick = (id, e) => {
    e.preventDefault();
    setNoticeId(id);
    setOpenNotice(true);
  };

  return (
    <div className="flex-1 pt-5 px-4 sm:pt-10 sm:pl-12 bg-blue-50/50 max-w-4xl mx-auto">
      <h1 className="text-lg font-semibold mb-4">All Comments</h1>

      <div className="space-y-3">
        {comments?.map((comment) => (
          <div
            key={comment._id}
            className="bg-white shadow border border-gray-200 rounded-md p-3"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5 uppercase font-medium">
                  {comment.targetType === "blog" ? "Blog" : "Notice"}
                </p>

                {comment.targetType === "blog" ? (
                  <a
                    href={`/blog/${comment.targetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                  >
                    Go to blog
                  </a>
                ) : (
                  <button
                    onClick={(e) => handleNoticeClick(comment.targetId, e)}
                    className="text-blue-600 text-xs hover:underline"
                  >
                    Go to notice
                  </button>
                )}
              </div>

              <div className="flex gap-2 text-xs">
                {editing === comment._id ? (
                  <>
                    <button
                      onClick={() => handleSave(comment._id)}
                      className="px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteComment(comment._id).then(() => loadComments(page))}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Accordion Body */}
            <button
              className="w-full text-left mt-1 text-gray-700 text-sm font-medium flex justify-between items-center"
              onClick={() =>
                setExpanded(expanded === comment._id ? null : comment._id)
              }
              aria-expanded={expanded === comment._id}
            >
              <span>{expanded === comment._id ? "Hide content" : "View content"}</span>
              <span className="text-gray-400">
                {expanded === comment._id ? "▲" : "▼"}
              </span>
            </button>

            {expanded === comment._id && (
              <div className="mt-2 border-t pt-2">
                {editing === comment._id ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}

                <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1">
                  <span>
                    Created by: {comment.createdBy?.email || `Guest: ${comment.name}`}
                  </span>
                  {comment.updatedBy && (
                    <span>• Last edited by: {comment.updatedBy?.email}</span>
                  )}
                  <span>• {timeAgo(comment.createdAt)}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {comments?.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-6">
            No comments found.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => loadComments(page - 1)}
            className={`px-3 py-1 text-sm rounded-md ${page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => loadComments(page + 1)}
            className={`px-3 py-1 text-sm rounded-md ${page === pages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Notice Modal */}
      {noticeId && (
        <NoticeModal
          open={openNotice}
          onClose={setOpenNotice}
          noticeId={noticeId}
        />
      )}
    </div>
  );
};

export default Comments;
