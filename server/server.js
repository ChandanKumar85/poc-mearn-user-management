// =======================
// Load Dependencies
// =======================
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// =======================
// Routes
// =======================
const AuthRoute = require('./routes/auth');
const EmployeeRoute = require('./routes/employee');

// =======================
// Database Connection
// =======================
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB || process.env.DATABASE_LOCAL)
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => console.error('❌ DB connection error:', err.message));

const db = mongoose.connection;
db.on('error', (err) => console.log('MongoDB error:', err.message));

// =======================
// Express App Setup
// =======================
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (uploads folder)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/employee', EmployeeRoute);
app.use('/api', AuthRoute);

// =======================
// Server Listener
// =======================
const PORT = process.env.PORT || 5001;
db.once('open', () => {
  console.log('✅ Database Connection Established!');
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
