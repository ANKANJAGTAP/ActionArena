import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import  bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './src/models/User.js';
import signupRoute from './src/routes/Rsignup.js';
import bodyParser from 'body-parser';
import loginRoute from './src/routes/login.js';
import dns from 'dns';
import emailExistence from 'email-existence';
import authMiddleware from './src/Utils/authmiddleware.js'
import { time } from "console";

dotenv.config();



const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
connectDB();

// Define schemas and models
const trainerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: String,
  category: String,
  image: String,
});
const Trainer = mongoose.model("Trainer", trainerSchema, "trainers");

const gameSchema = new mongoose.Schema({
  type: String,
  players: String,
  name: String,
  karma: Number,
  date: String,
  city: String,
  location: String,
  level: String,
  available: Boolean,
  messagefh: String,
  gname: String,
});
const Game = mongoose.model("Game", gameSchema, "descgames");

const sportSchema = new mongoose.Schema({
  name: String,
  image: String,
});
const Sport = mongoose.model("Sport", sportSchema, "sports");

const venueSchema = new mongoose.Schema({
  name: String,
  location: String,
  rating: Number,
  reviews: Number,
  image: String,
  bookable: Boolean,
  time: String,
});
const Venue = mongoose.model("Venue", venueSchema, "bookvenues");

// API Routes
app.use('/user',signupRoute);
app.use('/auth',loginRoute);

app.get("/trainers", async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/descgames", async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/descgames/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/sports", async (req, res) => {
  try {
    const sports = await Sport.find();
    res.json(sports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/bookvenues", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/bookvenues/:id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    res.json(venue);
  } catch (err) {
    res.status(500).json({ message: err.message }); 

  }
});
app.get('/profile', authMiddleware, async (req, res) => {
  try {
      const user = await User.findOne({ email: req.user.email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
app.get("/api/book", async (req, res) => {
  try {
    const { name } = req.query; // ✅ Extract name

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    /*{console.log("Fetching venues for name:", name)};*/

    const venues = await Venue.find({
      name: { $regex: name, $options: "i" }, // ✅ Search by name
    });

    if (venues.length === 0) {
      return res.status(404).json({ message: "No venues found with this name" });
    }

    res.json(venues);
  } catch (error) {
    console.error("❌ Error fetching venues:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/trainers", async (req, res) => {
  try {
    const { name } = req.query; // ✅ Extract name

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }


    const trainers = await Trainer.find({
      name: { $regex: name, $options: "i" }, // ✅ Search by name
    });

    if (trainers.length === 0) {
      return res.status(404).json({ message: "No Trainers found with this name" });
    }

    res.json(trainers);
  } catch (error) {
    console.error("❌ Error fetching Trainers:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/check-email", async (req, res) => {
  const email = req.query.email;

  // Regular expression to validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.json({ valid: false, message: "Invalid email syntax" });
  }

  const domain = email.split("@")[1];

  try {
    // Check if domain is accessible by making a request to it
    await axios.get(`https://${domain}`);
    return res.json({ valid: true, message: "Valid email domain" });
  } catch (error) {
    return res.json({ valid: false, message: "Invalid email domain" });
  }
});

app.put('/profile', authMiddleware, async (req, res) => {
  try {
      const updatedUser = await User.findOneAndUpdate(
          { email: req.user.email },
          req.body,
          { new: true, runValidators: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ message: 'User profile not found' });
      }

      res.json(updatedUser);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred",
  });
});
app.listen(5000, () => {
  console.log(`🚀 Server running on port 5000`);
});
