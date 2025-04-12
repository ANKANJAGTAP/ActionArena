import authService from "../services/login.js";

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const loginResponse = await authService.login(email, password);

    // ✅ Destructure token and user from the loginResponse
    const { token, user } = loginResponse;

    return res.status(200).json({
      message: "Login successful",
      token,
      user
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: error.message || "Invalid Credentials" });
  }
}

export default login;
