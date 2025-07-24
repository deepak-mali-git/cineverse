const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  password: { type: String, required: true },
  profilePicUrl: { type: String, default: '' }
}, { timestamps: true });

UserSchema.index({ fullName: 1 }, { 
  unique: true, 
  collation: { locale: 'en', strength: 2 } 
});

module.exports = mongoose.model('User', UserSchema);