import express from 'express';
import auth from '../middleware/auth.js';
import { adminOnly, moderatorAndAdminOnly } from '../middleware/acl.js';
import { getUser, login, register, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard, updateUserRole, deleteUser, getUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/", auth, getUser);
userRouter.get("/all", auth, getUsers);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.patch("/:id", auth, moderatorAndAdminOnly, updateUserRole);
userRouter.delete("/:id", auth, adminOnly, deleteUser);
userRouter.get("/comments", auth, getAllComments);
userRouter.get("/blogs", auth, getAllBlogsAdmin);
userRouter.post("/delete-comment", auth, deleteCommentById);
userRouter.post("/approve-comment", auth, approveCommentById);
userRouter.get("/dashboard", auth, getDashboard);

export default userRouter;