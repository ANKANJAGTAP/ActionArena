import mongoose from "mongoose";
const gameSchema = new mongoose.Schema({
  type: String,
  players: String,
  name: String,
  karma: Number,
  date: String,
  city: String,
  location: String,
  skills: { type: [String], default: [] },
  level: String,
  available: Boolean,
  messagefh: String,
  gname: String,
  userId: String,
});
const Game = mongoose.model("Game", gameSchema, "descgames");

export default Game;