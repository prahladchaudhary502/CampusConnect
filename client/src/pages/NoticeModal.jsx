import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useAppContext } from "../../context/AppContext";
import moment from "moment";
import CommentSection from "../components/comments/CommentSection";

const NoticeModal = ({ open, onClose, noticeId }) => {
  const { axios } = useAppContext();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Fetch notice details
  useEffect(() => {
    const fetchNotice = async () => {
      if (!open || !noticeId) return;
      setLoading(true);

      try {
        const { data } = await axios.get(`/api/notice/${noticeId}`);
        setNotice(data.notice);
      } catch (err) {
        console.error("Failed to fetch notice:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [open, noticeId, axios]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-10 space-x-2">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500">Loading notice...</span>
          </div>
        ) : notice ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {notice.title}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Created {moment(notice.createdAt).format("MMM Do YYYY, h:mm A")}
              </p>
            </DialogHeader>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Category:</span>{" "}
                <span className="capitalize">{notice.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${notice.status === "published"
                      ? "bg-green-100 text-green-700"
                      : notice.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {notice.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Audience:</span>{" "}
                {notice.audience?.join(", ")}
              </div>
            </div>

            {/* Content */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-2">Details</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {notice.content}
              </p>
            </div>

            {/* Attachments */}
            {notice.attachments?.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-2">Attachments</h4>
                <div className="flex flex-col gap-2">
                  {notice.attachments.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-gray-50 border p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      <span className="flex items-center gap-2 text-gray-700">
                        <span className="text-primary text-lg">📄</span>
                        {file.filename}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(file.url, "_blank");
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary hover:text-white transition"
                      >
                        ⬇️ Download
                      </button>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Accordion for Comments */}
            <div className="mt-6 border-t pt-4">
              <button
                className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                onClick={() => setShowComments(!showComments)}
              >
                <span className="font-medium text-gray-800">Comments</span>
                <span className="text-gray-500">
                  {showComments ? "▲" : "▼"}
                </span>
              </button>

              {showComments && (
                <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                  <CommentSection targetId={notice._id} targetType="notice" />
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-6">No notice found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NoticeModal;
