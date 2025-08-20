import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import cookieParser from "cookie-parser";
import noticeRouter from './routes/noticeRoutes.js';
import commentRouter from './routes/commentRoutes.js';

const app = express();

await connectDB()

//middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json())
app.use(cookieParser());

//Routes3
app.get('/', (req, res)=> res.send("API is Working"))
app.use('/api/user', userRouter)
app.use('/api/blog', blogRouter)
app.use('/api/notice',noticeRouter);
app.use('/api/comments',commentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server is running on port ' + PORT)
})

export default app;

