import { Activity } from "../models/activitySchema.js";

export const activityRepository = {
  createActivity: async (activityData) => {
    const activity = new Activity(activityData);
    return await activity.save();
  },

  findActivityById: async (id) => {
    return await Activity.findById(id).populate("owner invitees");
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
};
