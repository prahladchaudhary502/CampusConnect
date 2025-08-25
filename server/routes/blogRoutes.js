import express from "express";
import { addBlog, addComment, updateBlogById, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish, updateBlogStatusById, getPublishedBlogs } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.get('/', auth, getAllBlogs);
blogRouter.get('/public', getPublishedBlogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post("/add",auth, upload.single('image'), auth, addBlog)
blogRouter.put('/edit',auth, upload.single('image'), auth, updateBlogById);
blogRouter.patch('/edit/:id', auth, updateBlogStatusById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish);
blogRouter.post('/add-comment', auth, addComment);
blogRouter.post('/comments', auth, getBlogComments);

blogRouter.post('/generate', auth, generateContent);



export default blogRouter;