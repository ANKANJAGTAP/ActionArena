import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const SportsComplexGrid = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");

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

  // Fetch games only when city is set
  useEffect(() => {
    if (!city) return; // Wait until city is set

    const fetchGames = async () => {
      try {
        const response = await fetch("https://royal-dyanna-actionarena-5457ef91.koyeb.app/descgames");
        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }
        const data = await response.json();

        // Filter games based on the user's city
        const filteredGames = data.filter(
          (game) => game.city.toLowerCase() === city.toLowerCase()
        );
        setGames(filteredGames);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [city]);

  if (loading)
    return (
      <p className="text-center text-lg text-gray-600 py-10">
        Loading games...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20 rounded-2xl shadow-lg">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-2">
        Games in{" "}
        {city
          ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
          : "Loading..."}
      </h2>
      <p className="text-center text-lg text-gray-600 mb-8">
        Explore exciting games happening in{" "}
        <span className="font-semibold text-blue-700">
          {city || "your area"}
        </span>
        .
      </p>

      {games.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No games available in {city}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {games.map((game, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-300 hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <p className="text-sm sm:text-base text-gray-500 font-semibold uppercase">
                {game.type}
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-2 text-blue-700">
                {game.players}
              </p>
              <p className="text-gray-700 text-sm sm:text-base mt-1 font-medium">
                {game.name} |{" "}
                <span className="text-yellow-500">{game.karma} Karma</span>
              </p>
              <p className="text-gray-800 font-semibold mt-2 text-sm sm:text-base">
                {game.date}
              </p>
              <p className="text-gray-600 text-sm sm:text-base mt-1 flex items-center">
                📍 {game.location}, {game.city}
              </p>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                🎯 Skills:{" "}
                <span className="font-semibold">
                  {game.skills.length > 0 ? game.skills.join(", ") : "N/A"}
                </span>
              </p>
              <span className="mt-3 inline-block bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold px-4 py-1 rounded-full uppercase">
                {game.level}
              </span>
              {game.available ? (
                <button
                  onClick={() =>
                    (window.location.href = `https://action-arena.vercel.app/play/${game._id}`)
                  }
                  className="mt-4 w-full bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer text-sm sm:text-base"
                >
                  Book
                </button>
              ) : (
                <button className="mt-4 w-full bg-red-600 text-white px-5 py-2 rounded-lg font-semibold cursor-not-allowed text-sm sm:text-base">
                  Just Filled
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SportsComplexGrid;
