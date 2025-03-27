import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        toast.success("Login successful!", { autoClose: 2000 });
        setTimeout(() => navigate("/"), 2000);
      } else {
        if (result.message === "User already registered, please sign in") {
          toast.warn("User already registered. Please sign in!", { autoClose: 3000 });
        } else {
          toast.error(result.message || "Invalid credentials", { autoClose: 3000 });
        }
        setErrorMessage(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.", { autoClose: 3000 });
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-emerald-500 to-teal-600 p-4 sm:p-6"
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
    
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Login
          </button>
        </form>
    
        {/* Sign Up Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
  
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </motion.div>
  );
}
