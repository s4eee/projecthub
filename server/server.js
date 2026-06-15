const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (Tools that help process incoming data safely)
app.use(cors()); // Allows your upcoming frontend to connect to this API
app.use(express.json()); // Tells the server to read incoming JSON text data

// Your Very First Route (Endpoint)
app.get('/', (req, res) => {
  res.json({ message: "Welcome to ProjectHub API!" });
});

// Tell the server to start listening for requests
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});