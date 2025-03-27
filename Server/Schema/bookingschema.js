import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sportsFieldId: { type: mongoose.Schema.Types.ObjectId, ref: "SportsField"},
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;