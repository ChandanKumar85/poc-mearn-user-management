const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'This field is required'],
      minLength: [3, 'User Name must be at least 3 characters'],
      validate: {
        validator: function (v) {
          return /^[A-Za-z\s]+$/.test(v);
        },
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
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // only 10 digits
        },
        message: 'Phone number must be exactly 10 digits and only numbers',
      },
    },
    password: {
      type: String,
      required: [true, 'This field is required'],
      validate: {
        validator: function (v) {
          // Must be at least 8 chars, include 1 uppercase, 1 number, 1 special char
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v);
        },
        message: 'Password must be at least 8 characters long and include 1 uppercase, 1 number, and 1 special character',
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
    role: {
      type: String,
    },
    activeId: { type: String, default: null },
    sessionExpiresAt: { type: Date, default: null }, // ⬅️ store expiry
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
