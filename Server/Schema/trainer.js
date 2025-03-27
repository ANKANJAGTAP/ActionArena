import mongoose from "mongoose";
const trainerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: String,
  category: String,
  image: String,
});
const Trainer = mongoose.model("Trainer", trainerSchema, "trainers");

export default Trainer;