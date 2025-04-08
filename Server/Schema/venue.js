import mongoose from "mongoose";
const venueSchema = new mongoose.Schema({
  name: String,
  location: String,
  rating: Number,
  reviews: Number,
  image: String,
  bookable: Boolean,
  time: String,
  cost:Number
});
const Venue = mongoose.model("Venue", venueSchema, "bookvenues");

export default Venue;