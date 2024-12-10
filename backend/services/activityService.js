import { activityRepository } from "../repositories/activityRepository.js";

export const createActivity = async (activityData) => {
  return await activityRepository.createActivity(activityData);
};

export const getPublicActivities = async () => {
  return await activityRepository.findAllActivities({ visibility: "public" });
};
