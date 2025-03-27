import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const BookField = () => {
  const { id: fieldId } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [players, setPlayers] = useState("");
  const [userId, setUserId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [fieldName, setFieldName] = useState("");


  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Invalid token:", error);
        toast.error("Invalid session. Please log in again.");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/fields/${fieldId}`);
        const data = await response.json();
        if (response.ok) {
          setFieldName(data.name);
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

  useEffect(() => {
    if (date) {
      fetchBookedSlots();
    }
  }, [date]);

  const fetchBookedSlots = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/bookedslots?fieldId=${fieldId}&date=${date}`
      );
      const data = await response.json();
      if (response.ok) {
        setBookedSlots(data.slots);
      } else {
        toast.error(data.message || "Failed to fetch booked slots");
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      toast.error("Error fetching booked slots");
    }
  };

  const handleTimeChange = (setter) => (e) => {
    let time = e.target.value;
    if (time) {
      let [hour] = time.split(":"); 
      setter(`${hour}:00`); 
    }
  };

  const handleBooking = async () => {
    if (!userId || !date || !startTime || !endTime || !players) {
      toast.error("Please fill in all fields!");
      return;
    }

    const requestBody = {
      userId,
      sportsFieldId: fieldId,
      date,
      startTime,
      endTime,
      playersRequired: players,
    };

    const response = await fetch(`${backendUrl}/api/booknow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    toast(data.message);
    fetchBookedSlots();
  };

  const handleCreateRequest = () => {
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }
    navigate(`/book/${fieldId}/booknow/PlayerCreate`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-24">
      {/* Field Title Section */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          {fieldName ? `Booking for ${fieldName}` : "Loading Field Details..."}
        </h1>
      </div>

      {/* Booked Slots Section */}
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {date ? `Booked Slots on ${date}` : "Select a date to view booked slots"}
        </h2>
        {date && (
          <>
            {bookedSlots.length > 0 ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
                <ul className="list-disc ml-6">
                  {bookedSlots.map((slot, index) => (
                    <li key={index} className="mb-1">
                      {slot.startTime} - {slot.endTime}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-600">No slots are booked for this day.</p>
            )}
          </>
        )}
      </div>

      {/* Booking Form Section */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Book a Sports Field</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="sm:w-1/2">
              <label className="block text-gray-600 font-medium mb-2">Start Time</label>
              <input
                type="time"
                step="3600"
                value={startTime}
                onChange={handleTimeChange(setStartTime)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-1/2 mt-4 sm:mt-0">
              <label className="block text-gray-600 font-medium mb-2">End Time</label>
              <input
                type="time"
                step="3600"
                value={endTime}
                onChange={handleTimeChange(setEndTime)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">Number of Players Going</label>
            <input
              type="number"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              placeholder="e.g., 11"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleBooking}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
          >
            Book Now
          </button>

          <button
            onClick={handleCreateRequest}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
          >
            Create Players Request
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookField;
