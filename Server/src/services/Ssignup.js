import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseServiceKey } from "../config/supabaseConfig.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUser(userData) {
  const { username, email, password, phoneNumber, address, city, gender, role } = userData;

  // Attempt to sign up the user with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        email,
        username,
        phoneNumber,
        address,
        city,
        gender,
        role, // Save role in user_metadata too
      }
    }
  });

  if (error) {
    // Log the complete error details for debugging
    console.error("Supabase signup error:", JSON.stringify(error, null, 2));
    // Throw the error; if error.message is not available, include a fallback message.
    throw new Error(error.message || "Supabase signup failed with no error message");
  }

  // Optional: Save hashed password & other user info in MongoDB
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      city,
      gender,
      role,
    });
    await newUser.save();
  } catch (mongoError) {
    console.error("Error saving user to MongoDB:", mongoError.message);
    // Optionally, you could rethrow or handle the MongoDB error as needed.
  }

  return data;
}

export default { createUser };
