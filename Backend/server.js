//server.js
const express = require('express');
const cors = require('cors');
require('dotenv');

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors()); //Allow cross-origin requests
app.use(express.json()); //Parsing JSON Request Body

// Import routes
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

//Root routes -test server run or not
app.get('/Backend', (req, res) => {
  res.json({
    message: 'API server is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      passwords: '/api/passwords',
    },
  });
});

//Run server
app.listen(PORT, () => {
  console.log(`Server is runing on http://localhost:${PORT}`);
});
