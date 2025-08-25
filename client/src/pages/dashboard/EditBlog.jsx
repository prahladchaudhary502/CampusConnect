import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import BlogForm from "../../components/dashboard/BlogForm";

const EditBlog = () => {
  const { id } = useParams();
  const { axios, user, fetchBlogs } = useAppContext();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success) setBlog(data.blog);
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return <BlogForm existingBlog={blog} onSuccess={() => fetchBlogs({ createdByFilter: user._id })} />;

};

export default EditBlog;
