const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

// =======================
// User Schema
// =======================
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'This field is required'],
      minLength: [3, 'User Name must be at least 3 characters'],
      validate: {
        validator: (v) => /^[A-Za-z\s]+$/.test(v),
        message: 'User Name should not contain numbers or special characters',
      },
    },
    emailId: {
      type: String,
      required: [true, 'This field is required'],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, 'Enter a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'This field is required'],
      unique: true,
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v), // only 10 digits
        message: 'Phone number must be exactly 10 digits',
      },
    },
    password: {
      type: String,
      required: [true, 'This field is required'],
      validate: {
        validator: (v) => /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v),
        message: 'Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character',
      },
    },
    confirmPassword: {
      type: String,
      required: [true, 'This field is required'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    profilePhoto: { type: String },
    role: { type: String, default: 'user' },
    activeId: { type: String, default: null },
  },
  { timestamps: true }
);

// =======================
// Hash Password Before Save
// =======================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; // remove confirmPassword from DB
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
