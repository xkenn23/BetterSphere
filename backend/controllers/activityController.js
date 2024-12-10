import {
  createActivity,
  getPublicActivities,
} from "../services/activityService.js";

export const create = async (req, res) => {
  try {
    const activity = await createActivity(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
