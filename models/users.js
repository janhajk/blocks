const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
      _id: { type: Schema.Types.ObjectId },
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String, index: true },
      password: { type: String, bcrypt: true },
      timestamp: { type: Date, default: Date.now },
      memberships: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
      roles: [{ type: String }],
      properties: { type: Map, of: String },
      language: { type: Number }
});

module.exports = mongoose.model('User', User);
