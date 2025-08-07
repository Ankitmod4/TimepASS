// server.js
const DbConnect = require('./Database/Dbconnect');
const express = require('express');
const route = require('./Routes/route');
const cors=require('cors');
const app = express();
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes


app.use('/api', route); // Use the routes defined in route.js


DbConnect();
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});