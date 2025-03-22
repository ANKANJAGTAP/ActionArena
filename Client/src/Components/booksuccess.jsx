import React from "react";
import { useNavigate } from "react-router-dom";

const BookingSuccessful = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-gray-700 mt-2">Your booking has been confirmed.</p>
      <button
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
};

export default BookingSuccessful;
