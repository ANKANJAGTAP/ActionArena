import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function CreatePlayer() {
  const { id: fieldId } = useParams();
  const navigate = useNavigate();

  // Form fields
  const [type, setType] = useState("Mixed Doubles • Regular");
  const [name, setName] = useState("");
  const [goingPlayers, setGoingPlayers] = useState("");
  const [totalPlayers, setTotalPlayers] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");
  const [skills, setSkills] = useState("");
  const [messagefh, setMessagefh] = useState("");
  const [gname, setGname] = useState("");

  // Fields from token
  const [city, setCity] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCity(decoded.city);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
        toast.error("Invalid session. Please log in again.");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/fields/${fieldId}`);
        const data = await response.json();
        if (response.ok) {
          setLocation(data.name);
        } else {
          toast.error(data.message || "Failed to fetch field details");
        }
      } catch (error) {
        console.error("Error fetching field details:", error);
        toast.error("Error fetching field details");
      }
    };

    if (fieldId) {
      fetchFieldDetails();
    }
  }, [fieldId]);

  const handleTimeChange = (setter) => (e) => {
    let time = e.target.value;
    if (time) {
      let [hour] = time.split(":"); 
      setter(`${hour}:00`); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (
      !type ||
      !name ||
      !goingPlayers ||
      !totalPlayers ||
      !date ||
      !startTime ||
      !endTime ||
      !level ||
      !skills ||
      !messagefh ||
      !gname
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Compute the players string e.g., "3/6 Going"
    const players = `${goingPlayers}/${totalPlayers} Going`;

    // Format the date string to "22 Mar 2025"
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Convert start and end times to 12-hour format
    const formattedStartTime = new Date(`1970-01-01T${startTime}:00`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedEndTime = new Date(`1970-01-01T${endTime}:00`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Concatenate date and time into one string
    const combinedDate = `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;

    // Convert skills string into an array by splitting on commas and trimming spaces
    const skillsArray = skills.split(",").map((skill) => skill.trim());

    const requestBody = {
      type,
      players,
      name,
      date: combinedDate,
      location,
      city,
      level,
      skills: skillsArray,
      available: true, // default value
      messagefh,
      gname,
      userId,
    };

    try {
      const response = await fetch("http://localhost:5000/api/playerrequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      toast(data.message);
       navigate(`/play`);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("An error occurred while submitting your request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Player Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-gray-700 font-medium">Type</label>
            <input
              type="text"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Type"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Going Players & Total Players */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Going Players</label>
              <input
                type="number"
                name="goingPlayers"
                value={goingPlayers}
                onChange={(e) => setGoingPlayers(e.target.value)}
                placeholder="e.g., 3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Total Players</label>
              <input
                type="number"
                name="totalPlayers"
                value={totalPlayers}
                onChange={(e) => setTotalPlayers(e.target.value)}
                placeholder="e.g., 6"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Start Time & End Time */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Start Time</label>
              <input
                type="time"
                name="startTime"
                step="3600"
                value={startTime}
                onChange={handleTimeChange(setStartTime)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">End Time</label>
              <input
                type="time"
                name="endTime"
                step="3600"
                value={endTime}
                onChange={handleTimeChange(setEndTime)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          {/* Level */}
          <div>
            <label className="block text-gray-700 font-medium">Level</label>
            <input
              type="text"
              name="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="e.g., Amateur - Advance"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Skills */}
          <div>
            <label className="block text-gray-700 font-medium">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., skill1, skill2"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Message */}
          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              name="messagefh"
              value={messagefh}
              onChange={(e) => setMessagefh(e.target.value)}
              rows="4"
              placeholder="Enter your message..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Game Name */}
          <div>
            <label className="block text-gray-700 font-medium">Game Name</label>
            <input
              type="text"
              name="gname"
              value={gname}
              onChange={(e) => setGname(e.target.value)}
              placeholder="Game Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-300"
          >
            Submit Request
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default CreatePlayer;
