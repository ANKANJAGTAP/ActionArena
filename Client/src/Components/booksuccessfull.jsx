import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const BookingSuccess = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000"; // Adjust as needed

  useEffect(() => {
    const fetchBooking = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return navigate("/login");
      }
      
      try {
        if (token.split('.').length !== 3) {
          throw new Error("Invalid token format");
        }
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const response = await fetch(`${backendUrl}/api/bookings/latest/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        if (response.ok) {
          setBookingData(data.booking);
        } else {
          toast.error(data.message || "Failed to fetch booking.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching booking.");
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading booking details...</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500 font-semibold">No booking found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-green-600 mb-6 text-center">
          🎉 Booking Confirmed!
        </h1>
        <div className="space-y-4 text-lg text-gray-800">
          <div>
            <span className="font-semibold">Field Name:</span> {bookingData.fieldName}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {bookingData.date}
          </div>
          <div>
            <span className="font-semibold">Start Time:</span> {bookingData.startTime}
          </div>
          <div>
            <span className="font-semibold">End Time:</span> {bookingData.endTime}
          </div>
          <div>
            <span className="font-semibold">Players:</span> {bookingData.players}
          </div>
          <div>
            <span className="font-semibold">Amount Paid:</span> ₹{bookingData.paidAmount}
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300"
        >
          Back to Home
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookingSuccess;
