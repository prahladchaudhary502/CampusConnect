import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";
import { useNavigate } from "react-router-dom";

const BlogForm = ({ mode = "post", existingBlog = null, onSuccess }) => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (existingBlog) {
      setTitle(existingBlog.title || "");
      setSubTitle(existingBlog.subTitle || "");
      setCategory(existingBlog.category || "Startup");
      setIsPublished(existingBlog.status === "published");
      // fill editor with description
      if (quillRef.current) {
        quillRef.current.root.innerHTML = existingBlog.description || "";
      }
    }
  }, [existingBlog]);

  // Initialize Quill once
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  // Generate blog content using AI
  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", { prompt: title });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const status = isPublished
        ? mode === "request"
          ? "in-review"
          : "published"
        : "draft";

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        status,
      };

      let data;
      if (existingBlog) {
        // UPDATE blog
        const formData = new FormData();
        formData.append("newBlogData", JSON.stringify({ blog, blogId: existingBlog._id }));
        if (image) formData.append("image", image);

        const res = await axios.put("/api/blog/edit", formData);
        data = res.data;
      } else {
        // ADD blog
        const formData = new FormData();
        formData.append("blog", JSON.stringify(blog));
        if (image) formData.append("image", image);

        const res = await axios.post("/api/blog/add", formData);
        data = res.data;
      }

      if (data.success) {
        toast.success(data.message);
        onSuccess?.();
        if (!existingBlog) {
          // reset only for new add
          setImage(null);
          setTitle("");
          setSubTitle("");
          setCategory("Startup");
          quillRef.current.root.innerHTML = "";
          setIsPublished(false);
        }
        if(mode==="post")
          navigate('/dashboard/list/blog');
        else  
          navigate('/dashboard/request/blog/list');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 min-h-screen p-6 md:p-12 overflow-auto"
      aria-label={
        existingBlog
          ? "Edit Blog Form"
          : mode === "post"
            ? "Add Blog Form"
            : "Request Blog Review Form"
      }
    >
      <div className="bg-white rounded-lg shadow max-w-7xl mx-auto flex flex-col md:flex-row gap-10 p-6 md:p-10">
        {/* Left column */}
        <div className="flex-1 max-w-3xl space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <p className="font-semibold mb-1">Upload Thumbnail</p>
            <label htmlFor="image" className="inline-block cursor-pointer">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : existingBlog?.image || assets.upload_area
                }
                alt="Upload thumbnail preview"
                className="mt-2 h-16 rounded border border-gray-300 object-cover"
              />
              <input
                type="file"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0] || null)}
              />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold mb-1">Blog Title</label>
            <input
              type="text"
              required
              placeholder="Type here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Sub Title */}
          <div>
            <label className="block font-semibold mb-1">Sub Title</label>
            <input
              type="text"
              required
              placeholder="Type here"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Blog Description */}
          <div>
            <label className="block font-semibold mb-1">Blog Description</label>
            <div className="h-72 relative rounded border border-gray-300 bg-white overflow-scroll">
              <div ref={editorRef} className="h-full px-3 py-2"></div>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded">
                  <div className="w-8 h-8 border-2 border-t-white border-gray-300 rounded-full animate-spin"></div>
                </div>
              )}
              <button
                type="button"
                disabled={loading}
                onClick={generateContent}
                className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-70 px-4 py-1.5 rounded"
              >
                Generate with AI
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-1">Blog Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Select category</option>
              {blogCategories.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Publish/Request */}
          <div className="flex items-center gap-3">
            <label className="font-semibold cursor-pointer select-none">
              {mode === "post"
                ? "Publish Now"
                : existingBlog
                  ? "Update & Publish"
                  : "Request For Review"}
            </label>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="scale-125 cursor-pointer"
            />
          </div>

          {/* Submit */}
          <button
            disabled={isSaving}
            type="submit"
            className={`mt-6 w-40 h-10 rounded text-white ${isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dark"
              } transition-colors`}
          >
            {isSaving
              ? existingBlog
                ? "Updating..."
                : mode === "post"
                  ? "Adding..."
                  : "Requesting..."
              : existingBlog
                ? "Update Blog"
                : mode === "post"
                  ? "Add Blog"
                  : "Request Review"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
