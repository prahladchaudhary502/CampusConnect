import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNoticeById,
  deleteNoticeById,
  publishNoticeById
} from "../controllers/noticeController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const noticeRouter = express.Router();

noticeRouter.use(auth);

noticeRouter.post("/",upload.array("attachments", 5), createNotice);
noticeRouter.get("/",auth,getAllNotices);
noticeRouter.get("/:id", getNoticeById);
noticeRouter.put("/:id",auth,upload.array("attachments", 5), updateNoticeById);
noticeRouter.patch("/publish/:id",auth,publishNoticeById)
noticeRouter.delete("/:id",auth, deleteNoticeById);

export default noticeRouter;
