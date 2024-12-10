import { User } from "../models/users.js";

export const userRepository = {
  /**
   * Create a new user
   * @param {Object} userData - The user's registration data (username, email, password)
   * @returns {Object} - The newly created user
   */
  createUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },

  /**
   * Find a user by ID
   * @param {String} id - The user's ID
   * @returns {Object} - The found user
   */
  findUserById: async (id) => {
    return await User.findById(id);
  },

  /**
   * Find all users
   * @returns {Array} - List of all users
   */
  findAll: async () => {
    return await User.find();
  },

  /**
   * Find a user by username
   * @param {String} username - The username to search for
   * @returns {Object} - The found user
   */
  findUserByUsername: async (username) => {
    return await User.findOne({ username });
  },

  /**
   * Find a user by Email
   * @param {String} email - The email to search for
   * @returns {Object} - The found user
   */
  findUserByEmail: async (email) => {
    return await User.findOne({ email });
  },

  /**
   * Update a user's details
   * @param {String} id - The user's ID
   * @param {Object} updates - The fields to update
   * @returns {Object} - The updated user
   */
  updateUser: async (id, updates) => {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  },

  /**
   * Delete a user
   * @param {String} id - The user's ID
   * @returns {Object} - The deleted user
   */
  deleteUser: async (id) => {
    return await User.findByIdAndDelete(id);
  },
};
