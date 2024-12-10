import { userService } from "../services/userService.js";

/**
 * Registers a new user
 * @route POST /api/users/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Call the service to register the user
    const newUser = await userService.registerUser({
      username,
      email,
      password,
    });

    // Send success response
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    // Handle errors and send response
    res.status(400).json({
      error: error.message || "Failed to register user",
    });
  }
};

/**
 * Logs in a user
 * @route POST /api/users/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the service to sign in the user
    const { token, user } = await userService.signIn({ email, password });

    // Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    // Handle errors and send response
    res.status(400).json({
      error: error.message || "Failed to login",
    });
  }
};

//Get All User
export const getAllUser = async (req, res) => {
  try {
    const user = await userService.getAllUser();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const user = await userService.getUserByUsername(req.params.username);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Update user - Users can only update their own information
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.id,
      req.body,
      req.user._id // Current logged-in user's ID
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Delete user - Only admins can delete users
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id, req.user.role);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};
