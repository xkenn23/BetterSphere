import { activityRepository } from "../repositories/activityRepository.js";
import { generateReferralCode } from "../utils/referral.js";

export const activityService = {
  /**
   * Create a new activity
   * @param {Object} activityData - The data for the new activity
   * @returns {Object} - The created activity with a referral code
   */
  createActivity: async (activityData) => {
    // Generate a unique referral code for the activity
    activityData.referralCode = generateReferralCode();
    const newActivity = await activityRepository.createActivity(activityData);
    return newActivity;
  },

  /**
   * Get activity by ID
   * @param {String} id - The ID of the activity
   * @returns {Object} - The found activity
   */
  getActivityById: async (id) => {
    const activity = await activityRepository.findActivityById(id);
    if (!activity) throw new Error("Activity not found");
    return activity;
  },

  /**
   * Get all activities
   * @param {Object} filter - Filters for fetching activities
   * @returns {Array} - List of activities
   */
  getAllActivities: async (filter) => {
    return await activityRepository.findAllActivities(filter);
  },

  /**
   * Update an activity
   * @param {String} id - The ID of the activity
   * @param {Object} updates - The updates to be applied
   * @returns {Object} - The updated activity
   */
  updateActivity: async (id, updates) => {
    const updatedActivity = await activityRepository.updateActivity(
      id,
      updates
    );
    if (!updatedActivity) throw new Error("Activity not found");
    return updatedActivity;
  },

  /**
   * Delete an activity
   * @param {String} id - The ID of the activity
   * @returns {Object} - The deleted activity
   */
  deleteActivity: async (id) => {
    const deletedActivity = await activityRepository.deleteActivity(id);
    if (!deletedActivity) throw new Error("Activity not found");
    return deletedActivity;
  },

  /**
   * Join an activity using a referral code
   * @param {String} referralCode - The referral code for the activity
   * @param {String} userId - The ID of the user joining the activity
   * @returns {Object} - The updated activity with the user added as an invitee
   */
  joinActivityByReferralCode: async (referralCode, userId) => {
    // Find the activity by referral code
    const activity = await activityRepository.findActivityByReferralCode(
      referralCode
    );
    if (!activity) throw new Error("Invalid referral code");

    // Check if the user is already an invitee
    if (activity.invitees.includes(userId)) {
      throw new Error("User has already joined this activity");
    }

    // Add the user to the invitees list
    activity.invitees.push(userId);
    await activity.save();

    return activity;
  },

  /**
   * Remove an invitee from an activity
   * @param {String} activityId - The ID of the activity
   * @param {String} userId - The ID of the user to be removed
   * @returns {Object} - The updated activity with the user removed
   */
  removeInvitee: async (activityId, userId) => {
    const activity = await activityRepository.findActivityById(activityId);
    if (!activity) throw new Error("Activity not found");

    // Remove the user from the invitees list
    activity.invitees = activity.invitees.filter(
      (invitee) => invitee.toString() !== userId
    );
    await activity.save();

    return activity;
  },
};
