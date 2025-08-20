import express from "express";
import {
    createComment,
    getComments,
    updateComment,
    deleteComment,
    getCommentsForCreator,
} from "../controllers/commentController.js";
import auth from "../middleware/auth.js";

const commentRouter = express.Router();

commentRouter.get("/", getComments);
commentRouter.get("/creator", auth, getCommentsForCreator);
commentRouter.post("/", auth, createComment);
commentRouter.post("/guest", createComment);
commentRouter.patch("/:id", auth, updateComment);
commentRouter.delete("/:id", auth, deleteComment);

export default commentRouter;
