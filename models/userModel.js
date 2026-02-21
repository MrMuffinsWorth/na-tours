const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // bcrypt native may be better than bcryptjs
const catchAsync = require('../utils/catchAsync');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'A valid email is required.']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function(passwordConfirm) {
        return this.password === passwordConfirm
      },
      message: 'Passwords must match.'
    }
  }
})

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
