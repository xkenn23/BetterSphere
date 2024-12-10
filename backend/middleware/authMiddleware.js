import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository.js";

// Protect route - User must be authenticated
export const protect = async (req, res, next) => {
  try {
    // Get token from header (Bearer token)
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ error: "No token provided, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object
    req.user = await userRepository.findUserById(decoded.id);

    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Not authorized" });
  }
};

// Authorization middleware - check if user is admin for certain actions (like delete)
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied, insufficient permissions" });
    }
    next();
  };
};
