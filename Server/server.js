import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import jwt from 'jsonwebtoken';
import User from './src/models/User.js';
import signupRoute from './src/routes/Rsignup.js';
import bodyParser from 'body-parser';
import loginRoute from './src/routes/login.js';
import authMiddleware from './src/Utils/authmiddleware.js';
import crypto from "crypto";
import { time } from "console";
import Trainer from "./Schema/trainer.js";
import Game from "./Schema/gameschema.js";
import Sport from "./Schema/sports.js";
import Venue from "./Schema/venue.js";
import Booking from "./Schema/bookingschema.js";
import Razorpay from "razorpay";
import { secretKey } from './src/config/jwtConfig.js';
import mongoose from "mongoose";

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


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Set this in your environment
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

app.get("/getprofile", authMiddleware, async (req, res) => {
  try {
    // Use email from token to find the user
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in /getprofile route:", err.message);
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
app.get("/api/bookedslots", async (req, res) => {
  try {
      const { fieldId, date } = req.query;
      if (!fieldId || !date) {
          return res.status(400).json({ message: "Field ID and date are required." });
      }
      
      const slots = await Booking.find({ fieldId: fieldId, date }).select("startTime endTime -_id");
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
      capacity: venue.capacity,
      cost: venue.cost    
    });
  } catch (error) {
    console.error("Error fetching field details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.get("/api/bookings/latest/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const latestBooking = await Booking.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("fieldId", "name") // This will now populate from the Venue collection
      .lean();

    if (!latestBooking) {
      return res.status(404).json({ message: "No booking found." });
    }

    const bookingDetails = {
      fieldName: latestBooking.fieldId?.name || "N/A",
      date: latestBooking.date,
      startTime: latestBooking.startTime,
      endTime: latestBooking.endTime,
      players: latestBooking.players,
      paidAmount: latestBooking.paidAmount,
    };

    res.status(200).json({ booking: bookingDetails });
  } catch (error) {
    console.error("Error fetching latest booking:", error);
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
    const updatedTokenPayload = {
      id: updatedUser._id,
      email: updatedUser.email,
      city: updatedUser.city,
      role: updatedUser.role,
    };

    const updatedToken = jwt.sign(updatedTokenPayload, secretKey, {
      expiresIn: '1h',
    });
    return res.status(200).json({
      message: 'Profile updated successfully',
      token: updatedToken,
      user: updatedUser,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: err.message });
  }
});
app.post("/api/createOrder", async (req, res) => {
  try {
    const { amount, fieldId, date, startTime, endTime, players, userId } = req.body;

    if (!amount || !fieldId || !date || !startTime || !endTime || !players || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Math.random().toString(36).substring(7)}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    const newBooking = new Booking({
      userId: userId,
      fieldId,
      date,
      startTime,
      endTime,
      players,
      paidAmount: 0,
      paymentStatus: "pending",
      razorpayOrderId: order.id,
    });
    
    await newBooking.save();

    return res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: newBooking._id,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({ message: "Error creating order" });
  }
});

app.post("/api/verifyPayment", async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      fieldId,
      date,
      startTime,
      endTime,
      players,
      userId,
      paidAmount,
      bookingId,
    } = req.body;

    // Generate signature using orderCreationId and razorpayPaymentId
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderCreationId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid signature, payment not verified" });
    }

    // Update booking document with payment details
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paidAmount,
        paymentStatus: "paid",
        razorpayPaymentId,
        razorpaySignature,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ message: "Payment verified and booking updated successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Payment verification failed" });
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
