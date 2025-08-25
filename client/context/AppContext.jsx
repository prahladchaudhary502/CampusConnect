import { createContext, useContext, useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [blogsByStatus, setBlogsByStatus] = useState({
        draft: [],
        published: [],
        rejected: [],
        "in-review": []
    });

    const [noticeData, setNoticeData] = useState({
        notices: [],
        page: 1,
        totalPages: 1
    });

    const [input, setInput] = useState("")

    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchPublishedBlogs = async () => {
            try {
                const { data } = await axios.get("/api/blog/public");

                if (data.success) {
                    setBlogsByStatus((prev) => ({
                        ...prev,
                        published: data.blogs
                    }));
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.log(error)
                console.error(error.message);
            }
        };

        fetchUser();
        fetchNotices({ status: "published" });
        fetchPublishedBlogs();
    }, [])

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/', {
                withCredentials: true
            });
            if (data.success) {
                setUser(data.user);
                setLoading(false);
            }
        } catch {
            setUser(null);
        }
    }

    const fetchNotices = async ({ pageNum = 1, status, category, audience } = {}) => {
        try {
            const params = new URLSearchParams()
            if (status) params.append('status', status)
            if (category) params.append('category', category)
            if (audience) params.append('audience', audience)
            params.append('page', pageNum)
            params.append('limit', 10)

            const { data } = await axios.get(`/api/notice/?${params.toString()}`)

            if (data.success) {
                setNoticeData({
                    notices: data.notices,
                    page: data.page,
                    totalPages: data.totalPages
                })
            } else {
                console.error(data.message)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const fetchBlogs = async ({ statusFilter, createdByFilter } = {}) => {
        try {
            const queryParams = new URLSearchParams();

            if (statusFilter) {
                if (Array.isArray(statusFilter)) {
                    queryParams.append("status", statusFilter.join(","));
                } else {
                    queryParams.append("status", statusFilter);
                }
            }

            if (createdByFilter) {
                queryParams.append("createdBy", createdByFilter);
            }
            const { data } = await axios.get(`/api/blog/?${queryParams.toString()}`);

            if (data.success) {
                // segregate by status
                const segregated = {
                    draft: [],
                    published: [],
                    rejected: [],
                    "in-review": []
                };
                data.blogs.forEach((blog) => {
                    if (segregated[blog.status]) segregated[blog.status].push(blog);
                });
                setBlogsByStatus(segregated);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.log(error)
            console.error(error.message);
        }
    };

    const fetchComments = async (targetId, targetType, page = 1, limit = 10) => {
        try {
            const res = await axios.get(`/api/comments`, {
                params: { targetId, targetType, page, limit },
            });

            setComments(res.data.comments);

            return res.data
        } catch (err) {
            console.error("Failed to fetch comments", err);
        }
    };

    const fetchCommentsForCreator = async (page = 1, limit = 10) => {
        try {
            const res = await axios.get("/api/comments/creator", {
                params: { page, limit },
            });
            setComments(res.data.comments);
            return res.data;
        } catch (err) {
            console.error("Failed to fetch creator comments", err);
            return { total: 0, page: 1, pages: 0 };
        }
    };

    const createComment = async (payload) => {
        try {
            const res = await axios.post(`/api/comments`, payload);
            setComments((prev) => [res.data.comment, ...prev]);
            toast.success("Comment posted!");
        } catch (err) {
            console.error("Failed to create comment", err);
            toast.error(err.response?.data?.message || "Failed to create comment");
        }
    };

    const createGuestComment = async (payload) => {
        try {
            const res = await axios.post(`/api/comments/guest`, payload);
            setComments((prev) => [res.data.comment, ...prev]);
            toast.success("Comment posted!");
        } catch (err) {
            console.error("Failed to create guest comment", err);
            toast.error(err.response?.data?.message || "Failed to create guest comment");
        }
    };

    const updateComment = async (id, payload) => {
        try {
            const res = await axios.patch(`/api/comments/${id}`, payload);
            setComments((prev) =>
                prev.map((c) => (c._id === id ? res.data.comment : c))
            );
            toast.success("Comment updated!");
        } catch (err) {
            console.error("Failed to update comment", err);
            toast.error(err.response?.data?.message || "Failed to update comment");
        }
    };

    const deleteComment = async (id) => {
        try {
            await axios.delete(`/api/comments/${id}`);
            setComments((prev) =>
                prev.filter((c) => c._id !== id && c.parentComment !== id)
            );
            toast.success("Comment deleted");
        } catch (err) {
            console.error("Failed to delete comment", err);
            toast.error(err.response?.data?.message || "Failed to delete comment");
        }
    };


    const value = {
        axios, navigate, loading, user, setUser, blogsByStatus, setBlogsByStatus, input, setInput, noticeData,
        fetchNotices, fetchBlogs, comments, fetchComments, fetchCommentsForCreator, createComment, createGuestComment, updateComment, deleteComment
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
};