const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  displayName: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    maxLength: 500,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
    default: null,
  },
  profilePic: {
    type: String,
    default: '',
  },
  resetToken: String,
  resetTokenExpiry: Date,
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
  ],
  settings: {
    notifications: {
      type: Boolean,
      default: true,
    },
    emailUpdates: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: 'English',
      enum: ['English', 'Spanish', 'French', 'German'],
    },
    privacy: {
      type: String,
      default: 'Public',
      enum: ['Public', 'Friends', 'Private'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Hash the user's password before saving
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Compare entered password with hashed password
 * @param {string} inputPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
