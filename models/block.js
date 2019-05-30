const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Block = new Schema({
      _id: { type: Schema.Types.ObjectId },
      creator: { type: Schema.Types.ObjectId, ref: 'User' },
      owner: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp:  { type: Date, default: Date.now },
      type: { type: String, default: 'original' },
      parent: { type: Schema.Types.ObjectId, ref: 'Block' },
      children: [{type: Schema.Types.ObjectId, ref: 'Block'}],
      ancestor: { type: Schema.Types.ObjectId, ref: 'Block' },
      content: { type: String },
      content_type: { type: String },
      properties: { type: Map, of: String },
      weight: { type: Number, index: true },
      tags: [String],
      language: { type: Number },
});

module.exports = mongoose.model('Block', Block);
