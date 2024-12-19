import { Activity } from "../models/activity.js";

export const activityRepository = {
  createActivity: async (activityData) => {
    const activity = new Activity(activityData);
    return await activity.save();
  },

  findActivityByOwnerId: async (ownerId) => {
    console.log("Query:", { owner: ownerId });
    return await Activity.find({ owner: ownerId }).populate("owner invitees");
  },

  findAllActivities: async (filter) => {
    return await Activity.find(filter).populate("owner invitees");
  },

  updateActivity: async (id, updates) => {
    return await Activity.findByIdAndUpdate(id, updates, { new: true });
  },

  deleteActivity: async (id) => {
    return await Activity.findByIdAndDelete(id);
  },

  findActivityByReferralCode: async (referralCode) => {
    console.log("Query:", { referralCode });
    return await Activity.findOne({ referralCode }).populate("owner invitees");
  },
};
