import jwtDecode from "jwt-decode";

const token = localStorage.getItem("token"); // Get the token from local storage

if (token) {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);
    console.log("User Email:", decoded.email); // Example: Extract user email
  } catch (error) {
    console.error("Invalid token", error);
  }
}
