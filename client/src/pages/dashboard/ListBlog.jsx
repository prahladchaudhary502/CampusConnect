import React, { useMemo } from "react";
import BlogTableItem from "../../components/dashboard/BlogTableItem";
import { useAppContext } from "../../../context/AppContext";

const ListBlog = ({ statusFilter, createdByFilter }) => {
  const { blogsByStatus } = useAppContext();

  // compute visible blogs
  const blogs = useMemo(() => {
    if (!statusFilter || (Array.isArray(statusFilter) && statusFilter.length === 0)) {
      // no filter → merge all statuses
      return Object.values(blogsByStatus).flat();
    }
    if (Array.isArray(statusFilter)) {
      // multiple filters → combine selected
      return statusFilter.flatMap((status) => blogsByStatus[status] || []);
    }
    // single filter
    return blogsByStatus[statusFilter] || [];
  }, [statusFilter,createdByFilter,blogsByStatus]);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Blogs</h1>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-fixed text-sm text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs select-none">
            <tr>
              <th className="w-12 px-3 py-3 text-center">#</th>
              <th className="w-3/5 px-3 py-3 text-left">Blog Title</th>
              <th className="w-1/5 px-3 py-3 hidden sm:table-cell">Date</th>
              <th className="w-1/5 px-3 py-3 hidden sm:table-cell">Status</th>
              <th className="w-36 px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  index={index + 1}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-400 font-medium"
                >
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
