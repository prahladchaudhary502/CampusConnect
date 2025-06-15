import express from 'express';
import { adminLogin } from '../controllers/adminController.js'; // Import adminLogin function

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin); // Use the imported adminLogin function

export default adminRouter;