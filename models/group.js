const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Group = new Schema({
      _id: { type: Schema.Types.ObjectId },
      groupname: { type: String },
      logo: { data: Buffer, contentType: String },
      timestamp: { type: Date, default: Date.now },
      owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      properties: { type: Map, of: String }
});

module.exports = mongoose.model('Group', Group);

// https://stackoverflow.com/questions/29780733/store-an-image-in-mongodb-using-node-js-express-and-mongoose