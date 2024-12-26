require("dotenv").config(); // Import dotenv package and load variables from .env file
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Use the MONGO_URI stored in the .env file
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Define Team schema and model
const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamMembers: { type: Number, required: true },
  members: [
    {
      fullName: { type: String, required: false },
      email: { type: String, required: false },
      whatsapp: { type: Number, required: false },
      gender: { type: String, required: false },
      age: { type: Number, required: false },
      year: { type: String, required: false },
      department: { type: String, required: false },
      rollNumber: { type: Number, required: false },
    },
  ],
});

// Create the Team model
const Team = mongoose.model("Team", teamSchema);

// Middleware setup
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// Endpoint to handle team registration
app.post("/register", async (req, res) => {
  const { teamName, teamMembers, members } = req.body;

  // Basic validation (you can add more validation as per your requirements)
  if (!teamName || !teamMembers || !members || members.length !== teamMembers) {
    return res.status(400).json({ message: "Invalid team data." });
  }

  // Create a new Team document
  const newTeam = new Team({
    teamName,
    teamMembers,
    members,
  });

  try {
    // Save the new team to the MongoDB database
    await newTeam.save();
    res.status(200).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Error saving team to database:", err);
    res
      .status(500)
      .json({ message: "Error registering team. Please try again." });
  }
});

// Default route to check if the server is running
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
