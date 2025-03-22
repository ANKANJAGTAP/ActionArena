import React from "react";
import { ChevronLeft, ChevronRight, MapPin, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const venues = [
  {
    name: "Sanas Badminton Court",
    location: "Opp Apolo Spectra Hosp... (~2.01 Kms)",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070&auto=format&fit=crop",
    rating: "4.36",
    reviews: "(11)",
  },
  {
    name: "Global Sports Arcade",
    location: "GSA Seven Love Chowak... (~2.51 Kms)",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070&auto=format&fit=crop",
    rating: "3.71",
    reviews: "(7)",
  },
  {
    name: "Force Playing Fields",
    location: "Gokhale Path, Near Om... (~2.56 Kms)",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070&auto=format&fit=crop",
    rating: "0.00",
    reviews: "(0)",
  },
  {
    name: "The PickleBros Club",
    location: "Multi 4th Floor Roofto... (~2.63 Kms)",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070&auto=format&fit=crop",
    rating: "4.43",
    reviews: "(7)",
  },
];

const Middle = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [games, setGames] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch("https://royal-dyanna-actionarena-5457ef91.koyeb.app/sports");
        if (!response.ok) {
          throw new Error("Failed to fetch sports");
        }
        const data = await response.json();
        setSports(data.slice(0, Math.floor(Math.random() * 2) + 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:5000/descgames");
        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }
        const data = await response.json();
        setGames(data.slice(0, Math.floor(Math.random() * 2) + 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-gray-600">Loading...</p>
    );
  if (error)
    return (
      <p className="text-center mt-20 text-lg text-red-500">Error: {error}</p>
    );

  const handleNavigation = () => {
    if (token) {
      navigate("/play"); // If logged in, go to Play page
    } else {
      navigate("/signup"); // If not logged in, go to Signup page
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 sm:p-12 rounded-3xl mt-8">
      {/* Book Venues Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Book Venues
          </h2>
          <button
            onClick={handleNavigation}
            className="text-green-600 font-semibold cursor-pointer hover:underline text-sm sm:text-base"
          >
            SEE ALL VENUES &gt;
          </button>
        </div>
        <div className="relative mt-3">
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto p-2 sm:p-3 scrollbar-hide">
            {venues.map((venue, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md w-60 sm:w-72 flex-none p-3 transform transition hover:scale-105"
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="rounded-xl w-full h-32 sm:h-44 object-cover"
                />
                <h3 className="font-bold text-md sm:text-lg mt-2">
                  {venue.name}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {venue.location}
                </p>
                <span className="bg-green-100 text-green-700 text-xs sm:text-sm font-semibold px-2 py-1 rounded mt-2 inline-block">
                  ⭐ {venue.rating} {venue.reviews} Reviews
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Sports Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Popular Sports
        </h2>
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide p-2 sm:p-3 mt-3">
          {sports.map((sport, index) => (
            <div
              key={index}
              className="relative w-40 sm:w-52 h-56 sm:h-64 flex-none bg-gray-100 rounded-xl shadow-md transform transition hover:scale-105"
            >
              <img
                src={sport.image}
                alt={sport.name}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded">
                {sport.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discover Games Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mt-8 sm:mt-12">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Discover Games
          </h2>
          <button
            onClick={handleNavigation}
            className="text-green-600 cursor-pointer font-semibold hover:underline text-sm sm:text-base"
          >
            SEE ALL GAMES &gt;
          </button>
        </div>
        <div className="py-4 px-4 mt-4">
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            {games.map((game, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md border hover:shadow-2xl transition-transform transform hover:scale-105 w-56 sm:w-64"
              >
                <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase">
                  {game.type}
                </p>
                <p className="text-lg sm:text-xl font-bold mt-1 text-gray-800">
                  {game.players}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm mt-1 font-medium">
                  {game.name} |{" "}
                  <span className="text-yellow-500">{game.karma} Karma</span>
                </p>
                <p className="text-gray-800 font-semibold mt-1 text-sm sm:text-base">
                  {game.date}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 flex items-center">
                  📍 {game.location}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  🎯 Skills:{" "}
                  <span className="font-semibold">
                    {game.skills || "N/A"}
                  </span>
                </p>
                <span className="mt-2 inline-block bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full uppercase">
                  {game.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download App Button */}
      <div className="fixed bottom-5 right-5 bg-white p-3 sm:p-5 shadow-xl rounded-lg flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-100 transition">
        <QrCode size={24} />
        <span className="text-gray-800 font-semibold text-xs sm:text-sm">
          DOWNLOAD THE APP
        </span>
      </div>
    </div>
  );
};

export default Middle;
