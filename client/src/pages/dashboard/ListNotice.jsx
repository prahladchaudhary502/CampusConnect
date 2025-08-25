import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import NoticeModal from "../NoticeModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ListNotice = () => {
  const { axios, noticeData, fetchNotices } = useAppContext();
  const navigate = useNavigate();
  const { notices, page, totalPages } = noticeData;

  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleView = (id) => {
    setSelectedNoticeId(id);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit/notice/${id}`);
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this notice?")) return;
  try {
    setDeletingId(id);
    await axios.delete(`/api/notice/${id}`);
    toast.success("Notice deleted successfully.");
    fetchNotices(page);
  } catch (error) {
    toast.error(" Failed to delete notice. Please try again.",error);
  } finally {
    setDeletingId(null);
  }
};

  const handlePublish = async (id) => {
  try {
    setPublishingId(id);
    await axios.patch(`/api/notice/publish/${id}`);
    toast.success("Notice published successfully.");
    fetchNotices(page);
  } catch (error) {
    toast.error(" Failed to publish notice. Please try again.",error);
  } finally {
    setPublishingId(null);
  }
};

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Notices</h1>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full table-fixed text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="w-12 px-3 py-2">#</th>
              <th className="w-2/6 px-3 py-2 text-left">Title</th>
              <th className="w-1/6 px-3 py-2 hidden sm:table-cell">Category</th>
              <th className="w-1/6 px-3 py-2 hidden sm:table-cell">Status</th>
              <th className="w-28 px-3 py-2 hidden sm:table-cell">Created</th>
              <th className="w-52 px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.length > 0 ? (
              notices.map((notice, index) => (
                <tr
                  key={notice._id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-3 py-2 text-center">
                    {index + 1 + (page - 1) * 10}
                  </td>
                  <td
                    className="px-3 py-2 font-medium text-blue-600 hover:underline cursor-pointer truncate max-w-xs"
                    onClick={() => handleView(notice._id)}
                  >
                    {notice.title}
                  </td>

                  <td className="px-3 py-2 hidden sm:table-cell truncate max-w-[100px]">
                    {notice.category}
                  </td>
                  <td
                    className={`px-3 py-2 hidden sm:table-cell capitalize font-medium ${notice.status === "draft"
                        ? "text-yellow-600"
                        : "text-green-600"
                      }`}
                  >
                    {notice.status}
                  </td>
                  <td className="px-3 py-2 hidden sm:table-cell">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions inline (no wrap) */}
                  <td className="px-3 py-2">
                    <div className="flex justify-center items-center space-x-2 flex-nowrap">
                      <button
                        className="px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition"
                        onClick={() => handleEdit(notice._id)}
                      >
                        Edit
                      </button>
                      {notice.status === "draft" && (
                        <button
                          className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition disabled:opacity-50"
                          onClick={() => handlePublish(notice._id)}
                          disabled={publishingId === notice._id}
                        >
                          {publishingId === notice._id ? "..." : "Publish"}
                        </button>
                      )}
                      <button
                        className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                        onClick={() => handleDelete(notice._id)}
                        disabled={deletingId === notice._id}
                      >
                        {deletingId === notice._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-400 font-medium"
                >
                  No notices found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="max-w-6xl mx-auto flex justify-end items-center mt-6 space-x-3">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => fetchNotices(page - 1)}
        >
          Prev
        </button>
        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => fetchNotices(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Notice Details Modal */}
      <NoticeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        noticeId={selectedNoticeId}
      />
    </div>
  );
};

export default ListNotice;
