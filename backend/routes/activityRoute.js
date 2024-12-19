import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  joinActivityByReferralCode,
  getActivityById,
  removeInvitee,
  updateActivity,
  getActivitiesByOwnerId,
} from "../controllers/activityController.js";

const router = express.Router();

//route to create an activity
router.post("/create", protect, createActivity);

// route to get all activities
router.get("/", protect, getAllActivities);

// route to get activity by Id
router.get("/:ownerId", protect, getActivitiesByOwnerId);

// route to get activity by ID
router.get("/single/:id", protect, getActivityById);

// route to update an activity
router.put("/:id", protect, updateActivity);

// route to delete an activity
router.delete("/:id", protect, deleteActivity);

// route to join an activity by referral code
router.post("/join/:referralCode", protect, joinActivityByReferralCode);

// route to remove an invitee from an activity.
router.delete("/:activityId/invitees/:userId", removeInvitee);

export default router;
