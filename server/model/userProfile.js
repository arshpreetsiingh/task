const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  profilePhoto: String,
  username: { type: String, unique: true, required: true },
  currentPassword: String,
  newPassword: String,
  profession: String,
  companyName: String,
  addressLine1: String,
  country: String,
  state: String,
  city: String,
  subscriptionPlan: String,
  newsletter: Boolean
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
