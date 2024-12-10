import express from "express";
import {
  register,
  login,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to Register User
router.post("/register", register);

// Route to Login as User
router.post("/login", login);

// Route to get all users
router.get("/", protect, getAllUser);

// Route to get user by ID
router.get("/:id", protect, getUserById);

// Route to get user by username
router.get("/username/:username", protect, getUserByUsername);

// Route to update user - only allowed for the user themselves
router.put("/:id", protect, updateUser);

// Route to delete user - only allowed for admins
router.delete("/:id", protect, authorize(["admin"]), deleteUser);

export default router;
