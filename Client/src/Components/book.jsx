import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import VenueCard from "./VenueCard";
import {jwtDecode} from "jwt-decode";

const Book = () => {
  const [venues, setVenues] = useState([]);
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

  // Fetch venues based on the user's city
  useEffect(() => {
    if (!city) return; // Wait until city is set

    const fetchVenues = async () => {
      try {
        const response = await fetch("http://localhost:5000/bookvenues");
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }
        const data = await response.json();

        // Filter venues based on the user's city (assuming venues have a 'city' property)
        const filteredVenues = data.filter(
          (venue) =>
            venue.city && venue.city.toLowerCase() === city.toLowerCase()
        );
        setVenues(filteredVenues);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [city]);

  const tabs = [
    { id: "venues", label: "Venues", path: "/book" },
    { id: "events", label: "Events", path: "/events" },
    { id: "deals", label: "Deals", path: "/deals" },
  ];
  const location = useLocation();

  // Handle search: fetch venues by name from the backend only when Send is clicked
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchActive(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/book?name=${searchQuery}`
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

  // Determine which venues to display: search results (if search was triggered) or default venues
  const displayVenues = searchActive ? searchResults : venues;

  if (loading)
    return (
      <p className="text-center text-lg text-gray-600 py-10">
        Loading venues...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-green-400 to-blue-500 py-20 text-center text-white rounded-2xl mx-4 sm:mx-8 lg:mx-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Discover &amp; Book Sports Venues in{" "}
          {city
            ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
            : "Loading..."}
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Find the best venues to play, train, or just have fun.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto flex items-center bg-white rounded-full shadow-lg px-4 py-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full bg-transparent focus:outline-none text-gray-700"
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

      {/* Tabs Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-6 border-b pt-4">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`pb-3 text-lg font-semibold transition duration-300 ease-in-out ${
                    isActive
                      ? "border-b-4 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {displayVenues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {displayVenues.map((venue) => (
              <div
                key={venue._id || venue.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
              >
                <VenueCard venue={venue} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {searchActive
              ? "No search results found."
              : "No venues available."}
          </p>
        )}
      </main>
    </div>
  );
};

export default Book;
