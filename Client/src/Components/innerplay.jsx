import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const InnerPlay = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`http://localhost:5000/descgames/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch game");
        }
        const data = await response.json();
        setGame(data);
      } catch (err) {
        console.error("Error fetching game", err);
      }
    };

    fetchGame();
  }, [id]);

  // Wait for the game data and required date field
  if (!game || !game.date) {
    return <p>Loading game...</p>;
  }

  // Process the date string.
  const parts = game.date.split(",");
  const displayDate =
    parts.length >= 2 ? parts.slice(0, 2).join(",").trim() : game.date;
  const displayTime = parts.length >= 3 ? parts[2].trim() : "";

  // Process the location string to remove any extra distance info.
  const locationString = game.location || "";
  const shortLocation = locationString.includes("~")
    ? locationString.split("~")[0].trim()
    : locationString;

  // Extract players data from a string like "3/6 Going"
  const playersData = game.players || "";
  let playersGoing = 0;
  let totalPlayers = 0;
  let playersRequired = 0;
  const playersRegex = /^(\d+)\s*\/\s*(\d+)/;
  const match = playersData.match(playersRegex);
  if (match) {
    playersGoing = parseInt(match[1], 10);
    totalPlayers = parseInt(match[2], 10);
    playersRequired = totalPlayers - playersGoing;
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-green-200 to-green-400 min-h-screen p-6 rounded-2xl mt-20">
      <div className="relative bg-white shadow-2xl rounded-2xl p-10 max-w-4xl w-full transform transition duration-500 hover:scale-105 mt-28 overflow-hidden">
        {/* Decorative overlay for added visual depth */}
        <div className="absolute inset-0 bg-green-100 opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-green-800 text-center mb-4">
            {game.type || "Game Activity"}
          </h2>
          {game.gname && (
            <p className="text-xl text-green-700 text-center mb-2">
              Game: <span className="font-semibold">{game.gname}</span>
            </p>
          )}
          <p className="text-lg text-green-700 text-center mb-6">
            Hosted by{" "}
            <span className="font-semibold">{game.name || "Host Name"}</span>
          </p>

          <div className="flex flex-col md:flex-row justify-around items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📅</span>
              <span className="text-green-800 font-medium">
                {displayDate}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <span className="text-2xl">🕒</span>
              <span className="text-green-800">{displayTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-2xl">📍</span>
            <span className="text-green-800">{shortLocation}</span>
          </div>

          <div className="flex justify-center mb-6">
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transform transition duration-300"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    shortLocation
                  )}`,
                  "_blank"
                )
              }
            >
              Show In Map
            </button>
          </div>

          <div className="border-t border-green-300 pt-4 mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Game Instructions
            </h3>
            <div className="flex flex-col md:flex-row md:space-x-6 text-green-700">
              <p className="flex items-center">
                <span className="mr-2">🎮</span>{" "}
                {playersData
                  ? `${playersGoing} Going, ${playersRequired} Required`
                  : "Player info not available"}
              </p>
              <p className="flex items-center">
                <span className="mr-2">📊</span> {game.level || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow-inner">
            <h4 className="text-lg font-bold text-green-800 mb-2">
              Personal Message by the Host
            </h4>
            <p className="text-green-700">
              {game.messagefh ||
                "Share your mobile number when sending a request. Please ensure your number is correct so we can contact you if needed."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-6 mt-8">
        <button className="px-6 py-3 bg-green-300 text-green-800 rounded-full shadow-md hover:bg-green-400 transform transition duration-300">
          Send Query
        </button>
        <button className="px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transform transition duration-300">
          Join Game
        </button>
      </div>
    </div>
  );
};

export default InnerPlay;
