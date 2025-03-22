import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";

const Train = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  // Fetch user city from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCity(decoded?.city || "Unknown");
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  // Fetch trainers based on the user's city
  useEffect(() => {
    if (!city) return; // Wait until city is set

    const fetchTrainers = async () => {
      try {
        const response = await fetch("https://actionarena.onrender.com/trainers");
        if (!response.ok) {
          throw new Error("Failed to fetch trainers");
        }
        const data = await response.json();
        // Filter trainers based on the user's city (make sure trainer documents include a "city" property)
        const filteredTrainers = data.filter(
          (trainer) =>
            trainer.city &&
            trainer.city.toLowerCase() === city.toLowerCase()
        );
        setTrainers(filteredTrainers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [city]);

  // Handle search: fetch trainers by name from the backend only when Send is clicked
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchActive(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/trainers?name=${searchQuery}`
      );
      setSearchResults(response.data);
      setSearchActive(true);
    } catch (error) {
      console.error(
        "Error fetching search results:",
        error.response?.data || error
      );
      setSearchResults([]);
      setSearchActive(true);
    }
  };

  // Update search query and reset searchActive if the input is cleared
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setSearchActive(false);
    }
  };

  // Determine which trainers to display: search results (if search is active) or default trainers
  const displayTrainers = searchActive ? searchResults : trainers;

  if (loading)
    return (
      <p className="text-center text-lg text-gray-600 py-10">
        Loading trainers...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-green-400 to-blue-500 py-16 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Sports Trainers in{" "}
          {city
            ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
            : "Loading..."}
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Find professional coaches and academies to enhance your skills.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto flex items-center bg-white rounded-full shadow-lg px-4 py-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search for coaches / academies"
            className="flex-grow bg-transparent focus:outline-none px-2 text-gray-700"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button
            className="bg-green-500 text-white px-4 py-1 rounded-full ml-2 hover:bg-green-600 transition"
            onClick={handleSearch}
          >
            Send
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {displayTrainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayTrainers.map((trainer) => (
              <div
                key={trainer._id || trainer.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-80 object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    TRAINER
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {trainer.name}
                  </h2>
                  <p className="text-sm text-gray-500">{trainer.location}</p>
                  <p className="text-sm text-gray-500">{trainer.category}</p>
                  <p className="text-sm text-gray-500 mt-2">⭐ --</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {searchActive
              ? "No search results found."
              : "No trainers available."}
          </p>
        )}
      </main>
    </div>
  );
};

export default Train;
