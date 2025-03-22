import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parsePhoneNumber from "libphonenumber-js";

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateCity = async (city) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=India&format=json`);
      const data = await response.json();

      // Check if the city exists in India and is an exact match
      return data.some(entry => entry.display_name.includes("India") && entry.name.toLowerCase() === city.toLowerCase());
    } catch (error) {
      return false;
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const parsedNumber = parsePhoneNumber(phoneNumber, "IN");
    return parsedNumber && parsedNumber.isValid();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Form Data:", data);

    // Validate city
    const isValidCity = await validateCity(data.city);
    if (!isValidCity) {
      setError("city", { type: "manual", message: "Enter a valid full city name from India." });
      toast.error("Invalid city name. Must be a full city name from India.");
      setLoading(false);
      return;
    }

    // Validate phone number
    if (!validatePhoneNumber(data.phoneNumber)) {
      setError("phoneNumber", { type: "manual", message: "Enter a valid Indian phone number." });
      toast.error("Invalid Indian phone number.");
      setLoading(false);
      return;
    }

    // Email Verification
    try {
      const emailCheckResponse = await fetch(
        `https://actionarena.onrender.com/check-email?email=${encodeURIComponent(data.email)}`
      );
      const emailCheckData = await emailCheckResponse.json();

      if (!emailCheckData.valid) {
        toast.error(emailCheckData.message || "Invalid email address.");
        setLoading(false);
        return;
      }
    } catch (error) {
      toast.error("Error verifying email.");
      setLoading(false);
      return;
    }

    // Proceed with user registration
    try {
      const response = await fetch("https://actionarena.onrender.com/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("User created successfully!", { autoClose: 2000 });
        setTimeout(() => navigate("/login"), 2500);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-emerald-500 to-teal-600 p-4 sm:p-6"
    >
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Username */}
          <div>
            <input 
              {...register("username", { required: "Username is required" })} 
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input 
              type="email" 
              {...register("email", { required: "Email is required" })} 
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input 
              type="password" 
              {...register("password", { required: "Password is required" })} 
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <input 
              {...register("phoneNumber", { required: "Phone number is required" })} 
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>

          {/* Address */}
          <div>
            <input 
              {...register("address", { required: "Address is required" })} 
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>

          {/* City */}
          <div>
            <input 
              {...register("city", { required: "City is required" })} 
              placeholder="City"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
          </div>

          {/* Gender Selection */}
          <div>
            <select 
              {...register("gender", { required: "Gender is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className={`w-full ${loading ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"} text-white font-bold py-2 px-4 rounded-lg transition-all duration-300`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </motion.div>
  );
}
