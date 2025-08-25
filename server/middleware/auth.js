import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const token = req.cookies?.token;
    
    if (!token) {
        return res.status(401).json({ success: false, message: "No token, please login" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next()
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
}

export default auth;