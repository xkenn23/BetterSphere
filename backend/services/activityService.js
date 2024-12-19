import { activityRepository } from "../repositories/activityRepository.js";
import { generateReferralCode } from "../utils/referral.js";

export const activityService = {
  /**
   * Create a new activity with optional banner image upload
   * @param {Object} activityData - The data for the new activity
   * @param {Object} file - The uploaded file (optional)
   * @returns {Object} - The created activity with referral code
   */
  createActivity: async (activityData, file) => {
    // Generate a unique referral code
    activityData.referralCode = generateReferralCode();

    // If a file is provided, upload it to Cloudinary
    if (file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "activities" },
          (error, result) => {
            if (error) return reject(new Error("Cloudinary upload failed"));
            resolve(result.secure_url);
          }
        );
        file.stream.pipe(uploadStream); // Multer provides the file stream
      });

      activityData.bannerImage = uploadResult; // Save the secure URL
    }

    // Save activity to the database
    const newActivity = await activityRepository.createActivity(activityData);
    return newActivity;
  },

  /**
   * Get activities by owner ID
   * @param {String} ownerId - The ID of the activity owner
   * @returns {Array} - The activities found
   */
  getActivitiesByOwnerId: async (ownerId) => {
    const activities = await activityRepository.findActivityByOwnerId(ownerId);
    console.log("Owner ID in service:", ownerId, typeof ownerId); // Log ownerId and its type
    if (!activities || activities.length === 0) {
      throw new Error("No activities found for this owner");
    }
    return activities;
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
   * Get an activity by ID
   * @param {String} id - The ID of the activity
   * @returns {Object} - The activity details
   */
  getActivityById: async (id) => {
    const activity = await activityRepository.getActivityById(id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    return activity;
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
