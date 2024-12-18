import { activityService } from "../services/activityService.js";

/**
 * Create a new activity
 */
export const createActivity = async (req, res) => {
  try {
    const { id: userId } = req.user; // Extract user ID from authenticated user
    const activityData = { ...req.body, owner: userId }; // Include owner in the activity data
    const file = req.file; // Multer handles file parsing

    const newActivity = await activityService.createActivity(
      activityData,
      file
    );
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

/**
 * Get all activities with optional filters
 */
export const getAllActivities = async (req, res) => {
  try {
    const filter = req.query || {};
    const activities = await activityService.getAllActivities(filter);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

/**
 * Get activities by owner ID
 */
export const getActivitiesByOwnerId = async (req, res) => {
  try {
    const ownerId = req.params.ownerId; // Get ownerId from req.params
    const activities = await activityService.getActivitiesByOwnerId(ownerId);
    res.status(200).json(activities);
  } catch (error) {
    res.status(404).json({ error: error.message || "Server error" });
  }
};

/**
 * Update an activity
 */
export const updateActivity = async (req, res) => {
  try {
    const activity = await activityService.updateActivity(
      req.params.id,
      req.body,
      req.user.id // Assumes `req.user` contains authenticated user info
    );
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

/**
 * Delete an activity
 */
export const deleteActivity = async (req, res) => {
  try {
    await activityService.deleteActivity(req.params.id, req.user.id);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

/**
 * Join an activity using a referral code
 */
export const joinActivityByReferralCode = async (req, res) => {
  const { referralCode } = req.params;
  try {
    const activity = await activityService.joinActivityByReferralCode(
      referralCode,
      req.user.id
    );
    if (!activity)
      return res
        .status(404)
        .json({ error: "Invalid referral code or activity not found" });
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Controller to handle removing an invitee from an activity
export const removeInvitee = async (req, res) => {
  const { activityId, userId } = req.params;

  try {
    // Call the service function to remove the invitee
    const updatedActivity = await removeInviteeService(activityId, userId);

    // Respond with the updated activity
    res.status(200).json({
      message: "Invitee removed successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    // Handle errors (e.g., activity not found, other issues)
    res.status(500).json({
      error: error.message || "An error occurred while removing the invitee",
    });
  }
};
