import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository.js";

export const userService = {
  /**
   * Registers a new user
   * @param {Object} userData - The user's registration data (username, email, password)
   * @returns {Object} - The newly created user's basic details
   */
  registerUser: async (userData) => {
    const { username, email, password } = userData;

    // Check if a user already exists with the provided email
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create a new user (password hashing is handled by the User model pre-save hook)
    const newUser = await userRepository.createUser({
      username,
      email,
      password,
    });

    // Return user details without sensitive information like password
    return {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
  },

  /**
   * Signs in a user
   * @param {Object} credentials - The user's login credentials (email, password)
   * @returns {Object} - The JWT token and basic user details
   */
  signIn: async (credentials) => {
    const { email, password } = credentials;

    // Find the user by email
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiration time
    );

    // Return the token and user details
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  },

  /**
   * Find all users
   * @returns {Array} - List of all users
   */
  getAllUser: async () => {
    const user = await userRepository.findAll();
    return user;
  },

  /**
   * Get user by ID
   * @param {String} userId - The user's ID
   * @returns {Object} - The user details
   */
  getUserById: async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  },

  /**
   * Get user by username
   * @param {String} username - The user's username
   * @returns {Object} - The user details
   */
  getUserByUsername: async (username) => {
    const user = await userRepository.findUserByUsername(username);
    if (!user) throw new Error("User not found");
    return user;
  },

  /**
   * Update a user's details
   * @param {String} userId - The user's ID
   * @param {Object} updatedData - The updated user data (username, password)
   * @param {String} currentUserId - The ID of the user performing the update
   * @returns {Object} - The updated user details
   */
  updateUser: async (userId, updatedData, currentUserId) => {
    if (userId !== currentUserId.toString()) {
      throw new Error("You can only update your own profile");
    }

    // Check if a password is included in the updated data
    if (updatedData.password) {
      // Hash the new password before saving it
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    const updatedUser = await userRepository.updateUser(userId, updatedData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  },

  /**
   * Delete a user - Only admins can delete users
   * @param {String} userId - The user's ID
   * @param {String} currentUserRole - The role of the user performing the deletion
   * @returns {Object} - A confirmation message or error
   */
  deleteUser: async (userId, currentUserRole) => {
    if (currentUserRole !== "admin") {
      throw new Error("Only admins can delete users");
    }

    const deletedUser = await userRepository.deleteUser(userId);
    if (!deletedUser) throw new Error("User not found");
    return { message: "User deleted successfully" };
  },
};
