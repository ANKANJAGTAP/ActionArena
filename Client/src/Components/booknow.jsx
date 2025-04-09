import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-time-picker/dist/TimePicker.css";
import TimePicker from "react-time-picker";

const BookField = () => {
  const { id: fieldId } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [players, setPlayers] = useState("");
  const [userId, setUserId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [loading, setLoading] = useState(false);
  const [perHourCost, setPerHourCost] = useState(0);
  const [price, setPrice] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // ✅ Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, "0");
    return `${h}:00`;
  });

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
          setPerHourCost(data.cost ||0);
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
    if (date) fetchBookedSlots();
  }, [date]);

  const fetchBookedSlots = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/bookedslots?fieldId=${fieldId}&date=${date}`
      );
      const data = await response.json();
      if (response.ok) {
        setBookedSlots(data.slots); // Now correctly using data.slots
      } else {
        toast.error(data.message || "Failed to fetch booked slots");
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      toast.error("Error fetching booked slots");
    }
  };
  

  const computePrice = () => {
    if (startTime && endTime && perHourCost) {
      const [sHour, sMinute] = startTime.split(":").map(Number);
      const [eHour, eMinute] = endTime.split(":").map(Number);
      const startTotal = sHour * 60 + sMinute;
      const endTotal = eHour * 60 + eMinute;
      const diffMinutes = endTotal - startTotal;
      if (diffMinutes > 0) {
        return (diffMinutes / 60) * perHourCost;
      }
    }
    return 0;
  };

  useEffect(() => {
    setPrice(computePrice());
  }, [startTime, endTime, perHourCost]);

  // ✅ Razorpay Payment Handler
  const handlePayment = async () => {
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      toast.error("Failed to load Razorpay SDK. Please check your internet.");
      return;
    }

    if (!userId || !date || !startTime || !endTime || !players) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);
    const currentPrice = computePrice();

    const orderResponse = await fetch(`${backendUrl}/api/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        amount: currentPrice * 100,
        fieldId,
        date,
        startTime,
        endTime,
        players,
        userId,
      }),
    });

    const orderData = await orderResponse.json();
    if (!orderResponse.ok) {
      toast.error(orderData.message || "Order creation failed");
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_DdNb4pPxdAKQyu",
      amount: orderData.amount,
      currency: orderData.currency,
      name: fieldName,
      description: "Field Booking Payment",
      order_id: orderData.id,
      handler: async (response) => {
        const verifyResponse = await fetch(`${backendUrl}/api/verifyPayment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            orderCreationId: orderData.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            fieldId,
            date,
            startTime,
            endTime,
            players,
            userId,
            paidAmount: currentPrice,
            bookingId: orderData.bookingId,
          }),
        });

        const verifyData = await verifyResponse.json();
        if (verifyResponse.ok) {
          toast("Payment successful and booking updated!");
          navigate("/booking-success");
        } else {
          toast.error(verifyData.message || "Payment verification failed");
        }
        setLoading(false);
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
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
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          {fieldName ? `Booking for ${fieldName}` : "Loading Field Details..."}
        </h1>
      </div>

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

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Book a Sports Field
        </h2>
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
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-1/2 mt-4 sm:mt-0">
        <label className="block text-gray-600 font-medium mb-2">End Time</label>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
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
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
          >
            {loading ? "Processing..." : `Pay ₹${price}`}
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
