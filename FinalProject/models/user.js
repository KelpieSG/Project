let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

// Define User schema
let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

// Add passport-local-mongoose plugin to handle password hashing
UserSchema.plugin(passportLocalMongoose);

// Export User model
module.exports = mongoose.model('User', UserSchema);
