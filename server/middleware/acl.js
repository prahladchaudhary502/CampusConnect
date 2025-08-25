
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  next();
};

export const moderatorAndAdminOnly = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "moderator") {
    console.log(req.user.role)
    return res.status(403).json({ error: "Access denied: Admins & moderator only" });
  }
  next();
};
