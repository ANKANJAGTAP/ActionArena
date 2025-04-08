import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // note: use default import for jwt-decode
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [city, setCity] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCity(decoded?.city || "Unknown");
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 mt-12 md:mt-60">
      {/* Left Section */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-full w-fit text-gray-700 font-bold">
          <MapPin size={18} />
          <span>{city ? city.toUpperCase() : "Loading..."}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          FIND PLAYERS & VENUES <br /> NEARBY
        </h1>
        <p className="text-gray-600 text-lg">
          Seamlessly explore sports venues and play with sports enthusiasts just like you!
        </p>
        <div>
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/play")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300"
            >
              Explore Games
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300"
            >
              Login
            </button>
          )}
        </div>
      </div>
      {/* Right Section - Image Grid */}
      <div className="relative w-full md:w-1/2 mt-8 md:mt-0 grid grid-cols-2 grid-rows-2 gap-2">
        <img
          src="https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?q=80&w=1974&auto=format&fit=crop"
          alt="Basketball"
          className="rounded-xl w-full h-auto shadow-lg col-span-1 row-span-2"
        />
        <img
          src="https://media.istockphoto.com/id/1040174716/photo/line-on-green-badminton-court.webp?a=1&b=1&s=612x612&w=0&k=20&c=r5RrLn1AnW0tVgPXGxujSUUPotHxbLw63NGcCDl-PbA="
          alt="Badminton"
          className="rounded-xl w-full h-auto shadow-lg col-span-1 row-span-1"
        />
        <img
          src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070&auto=format&fit=crop"
          alt="Football"
          className="rounded-xl w-full h-auto shadow-lg col-span-1 row-span-1"
        />
        {/* Decorative Tennis Icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-3 rounded-full shadow-lg">
          🎾
        </div>
        {/* Platform Text */}
        <div className="absolute left-0 top-1/2 text-gray-400 text-sm tracking-widest rotate-90">
          P L A T F O R M
        </div>
      </div>
    </div>
  );
};

export default Home;
