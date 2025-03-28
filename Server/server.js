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
import authMiddleware from './src/Utils/authmiddleware.js';
import nodemailer from "nodemailer";
import crypto from "crypto";
import { time } from "console";
import Trainer from "./Schema/trainer.js";
import Game from "./Schema/gameschema.js";
import Sport from "./Schema/sports.js";
import Venue from "./Schema/venue.js";
import Booking from "./Schema/bookingschema.js";

dotenv.config();

const app = express();
const emailVerificationTokens = {}; 
app.use(cors({
  origin: [
    "http://localhost:5173",  // Allow local development
    "https://action-arena.vercel.app",  // Allow production frontend
    "https://action-arena-git-main-ankanjagtaps-projects.vercel.app"  // Allow preview frontend
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
connectDB();

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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.json({ valid: false, message: "Invalid email syntax" });
  }
  const verificationToken = crypto.randomBytes(16).toString("hex");
  
  emailVerificationTokens[email] = verificationToken;

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: '"ActionArena" <881bb8002@smtp-brevo.com>',
    to: email,
    subject: "Please verify your email address",
    text: `Hello,\n\nPlease verify your email address by clicking the link below:\n\n` +
          `https://yourapp.com/verify-email?email=${encodeURIComponent(email)}&token=${verificationToken}\n\n` +
          `If you did not sign up for this account, please ignore this email.\n\nThanks!`
  };
  

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ valid: true, message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.json({ valid: false, message: "Failed to send verification email." });
  }
});
app.get("/api/bookedslots", async (req, res) => {
  try {
      const { fieldId, date } = req.query;
      if (!fieldId || !date) {
          return res.status(400).json({ message: "Field ID and date are required." });
      }
      
      const slots = await Booking.find({ sportsFieldId: fieldId, date }).select("startTime endTime -_id");
      res.status(200).json({ slots });
  } catch (error) {
      console.error("Error fetching booked slots:", error);
      res.status(500).json({ message: "Server error. Please try again later!" });
  }
});
app.get("/api/fields/:id", async (req, res) => {
  try {
    const fieldId = req.params.id; 
    const venue = await Venue.findById(fieldId); 

    if (!venue) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json({ 
      name: venue.name,
      location: venue.location,     
      capacity: venue.capacity    
    });
  } catch (error) {
    console.error("Error fetching field details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
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
app.post("/api/booknow", async (req, res) => {
  try {
      const { userId, sportsFieldId, date, startTime, endTime, playersRequired } = req.body;

  
      if (!userId || !sportsFieldId || !date || !startTime || !endTime || playersRequired === undefined) {
          return res.status(400).json({ message: "All fields are required!" });
      }

      const parsedStartTime = new Date(`${date}T${startTime}:00.000Z`);
      const parsedEndTime = new Date(`${date}T${endTime}:00.000Z`);

      if (parsedEndTime <= parsedStartTime) {
          return res.status(400).json({ message: "End time must be after start time!" });
      }

      const existingBooking = await Booking.findOne({
          sportsFieldId,
          date,
          $or: [
              { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
          ]
      });

      if (existingBooking) {
          return res.status(400).json({ message: "Time slot already booked!" });
      }

      // Create and save the new booking, including the playersRequired field.
      const newBooking = new Booking({
          userId,
          sportsFieldId,
          date,
          startTime,
          endTime,
          playersRequired, // Save the number of players required
          status: "confirmed"
      });

      await newBooking.save();
      res.status(201).json({ message: "Booking confirmed!" });

  } catch (error) {
      console.error("Booking Error:", error);
      res.status(500).json({ message: "Server error. Please try again later!" });
  }
});
app.post("/api/playerrequest", async (req, res) => {
  const {
    type,
    players,
    name,
    date,
    city,
    location,
    level,
    available,
    messagefh,
    gname,
    karma,
    skills,
    userId // might be a string or an array
  } = req.body;

  if (!type || !players || !name || !date || !city || !location || !level || !messagefh || !gname || !userId) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  // Convert skills to an array if it is not already
  let skillsArray = [];
  if (typeof skills === "string") {
    skillsArray = skills.split(",").map(skill => skill.trim());
  } else if (Array.isArray(skills)) {
    skillsArray = skills;
  }

  const newGame = new Game({
    type,
    players,
    name,
    date,
    city,
    location,
    level,
    skills: skillsArray, // save as an array
    available: available !== undefined ? available : true,
    messagefh,
    gname,
    karma: karma !== undefined ? karma : 0,
    userId
  });

  try {
    const savedGame = await newGame.save();
    res.status(201).json({
      message: "Game request created successfully",
      game: savedGame,
    });
  } catch (error) {
    console.error("Error saving game request:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.listen(5000, () => {
  console.log(`🚀 Server running on port 5000`);
});
