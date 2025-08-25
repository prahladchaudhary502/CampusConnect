import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../../context/AppContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const BlogTableItem = ({ blog, index }) => {
  const { _id, title, createdAt } = blog;
  const BlogDate = new Date(createdAt);
 
  const { axios, user, setBlogsByStatus } = useAppContext();
  const navigate = useNavigate();

  const deleteBlog = async () => {
    const confirm = window.confirm('Are you sure you want to delete this blog?')
    if (!confirm) return;
    try {
      const { data } = await axios.post('/api/blog/delete', { id: blog._id })
      if (data.success) {
         toast.success("Deleted blog successfully")
        setBlogsByStatus(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(status => {
            updated[status] = updated[status].filter(b => b._id !== _id);
          });
          return updated;
        });
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateStatus =  (newStatus) => {
    setBlogsByStatus(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(status => {
            updated[status] = updated[status].filter(b => b._id !== _id);
          });
          updated[newStatus] = [...updated[newStatus], { ...blog, status: newStatus }];
          return updated;
        });
  }
  const publishBlog = async () => {
    try {
      const { data } = await axios.patch(`/api/blog/edit/${_id}`, { blogId: blog._id, status: "published" })
      if (data.success) {
        toast.success("Published blog successfully")
        updateStatus("published");
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const approveBlog = async () => {
    try {
      const { data } = await axios.patch(`/api/blog/edit/${_id}`, { blogId: blog._id, status: "published" })
      if (data.success) {
        toast.success("Published blog successfully")
        updateStatus("published");
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const rejectBlog = async () => {
    try {
      const { data } = await axios.patch(`/api/blog/edit/${_id}`, { blogId: blog._id, status: "rejected" })
      if (data.success) {
         toast.success("Rejected blog successfully")
        updateStatus("rejected");
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const editBlog = async () => {
    navigate(`/dashboard/edit/blog/${_id}`);
  };

  return (
    <tr className='border-y border-gray-300'>
      <th className='px-2 py-4'>{index}</th>
      <td className="px-2 py-4 text-blue-600 font-medium">
        <Link to={`/blog/${_id}`} className="hover:underline">
          {title}
        </Link>
      </td>
      <td className='px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={
            blog.status === "published"
              ? "text-green-600"
              : blog.status === "in-review"
                ? "text-blue-600"
                : blog.status === "rejected"
                  ? "text-red-600"
                  : "text-orange-700"
          }
        >
          {blog.status === "published"
            ? "Published"
            : blog.status === "in-review"
              ? "In Review"
              : blog.status === "rejected"
                ? "Rejected"
                : "Draft"}
        </p>
      </td>

      <td className="px-2 py-4 flex text-xs gap-3">
        {/* DRAFT */}
        {blog.status === "draft" && (
          <>
            <button
              onClick={editBlog}
              className="border px-2 py-0.5 mt-1 rounded cursor-pointer text-gray-600 hover:bg-gray-50"
            >
              Edit
            </button>
            {user.role === "admin" && (
              <button
                onClick={publishBlog}
                className="border px-2 py-0.5 mt-1 rounded cursor-pointer text-blue-600 hover:bg-blue-50"
              >
                Publish
              </button>
            )}
          </>
        )}

        {/* IN REVIEW */}
        {blog.status === "in-review" && (
          user.role === "admin" ? (
            <>
              <button
                onClick={approveBlog}
                className="border px-2 py-0.5 mt-1 rounded cursor-pointer text-green-600 hover:bg-green-50"
              >
                Approve
              </button>
              <button
                onClick={rejectBlog}
                className="border px-2 py-0.5 mt-1 rounded cursor-pointer text-red-600 hover:bg-red-50"
              >
                Reject
              </button>
            </>
          ) : (
            <span className="border px-2 py-0.5 mt-1 rounded text-gray-500">
              Pending Review
            </span>
          )
        )}

        {/* PUBLISHED */}
        {blog.status === "published" && (
          <button
            onClick={() => toast("TODO: unpublish API")}
            className="border px-2 py-0.5 mt-1 rounded cursor-pointer text-orange-600 hover:bg-orange-50"
          >
            Unpublish
          </button>
        )}

        {/* REJECTED */}
        {blog.status === "rejected" && (
          user.role === "admin" ? (
            <span className="text-gray-500">No actions</span>
          ) : (
            <button
              onClick={editBlog}
              className="border px-2 py-0.5 mt-1 rounded cursor-pointer text-red-600 hover:bg-red-50"
            >
              Edit & Resubmit
            </button>
          )
        )}

        {/* DELETE ICON (always available) */}
        <img
          src={assets.cross_icon}
          className="w-8 hover:scale-110 transition-all cursor-pointer"
          alt="delete"
          onClick={deleteBlog}
        />
      </td>

    </tr>
  )
}

export default BlogTableItem
