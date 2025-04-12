import userService from "../services/Ssignup.js";

async function createUser(req, res) {
  try {
    const userData = req.body;
    const supabaseData = await userService.createUser(userData);
    res.status(201).json({ message: "User created successfully", data: supabaseData });
  } catch (error) {
    // Log the error message and details for debugging
    console.error("Signup error:", error.message);
    console.error("Complete Signup error:", error);
    res.status(500).json({ error: error.message });
  }
}

export default createUser;
