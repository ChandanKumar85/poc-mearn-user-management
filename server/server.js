  require('./jobs/sessionCleaner'); // starts cron automatically
  const express = require('express');
  const mongoose = require('mongoose');
  const morgan = require('morgan');
  const bodyParser = require('body-parser');
  const cors = require('cors');

  const dotenv = require('dotenv');
  dotenv.config();

  // Auth
  const AuthRoute = require('./routes/auth');

  const EmployeeRoute = require('./routes/employee');

  const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

  mongoose
    .connect(DB || process.env.DATABASE_LOCAL)
    .then((con) => {
      console.log('DB connection successful!');
    })
    .catch((err) => {
      console.error('DB connection error:', err.message);
    });

  const db = mongoose.connection;
  db.on('error', (err) => {
    console.log(err);
  });

  const app = express();
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/uploads', express.static('uploads'));

  const PORT = process.env.PORT || 5001;

  db.once('open', () => {
    console.log('Database Connection Established!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });

  app.use('/api/employee', EmployeeRoute);
  app.use('/api', AuthRoute);
