const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

// Auth
const AuthRoute = require('./routes/auth');

const EmployeeRoute = require('./routes/employee');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => {
  console.log(err);
});

const app = express();
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
