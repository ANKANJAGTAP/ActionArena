import mongoose from "mongoose";
const sportSchema = new mongoose.Schema({
  name: String,
  image: String,
});
const Sport = mongoose.model("Sport", sportSchema, "sports");

export default Sport;