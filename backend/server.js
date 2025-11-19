//server.js
const express = require('express');
const cors = require( 'cors' );
const rateLimit = require( 'express-rate-limit' );
const helmet = require( 'helmet' );
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(cors()); //Allow cross-origin requests
app.use( express.json() ); //Parsing JSON Request Body
app.use( helmet() ); // security headers

// Import routes
const authRoutes = require('./routes/auth');
const passwordRoutes = require( './routes/passwords' );
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders:false,
} );
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders:false,
});

// rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiLimiter);

// Use routes
app.use('/api/auth', authRoutes);
app.use( '/api/passwords', passwordRoutes );


//Root routes -test server run or not
app.get('/', (_req, res) => {
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
