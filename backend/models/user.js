//create the schema for the user model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email:   { type: String, required: true },
  name:    { type: String },
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User;