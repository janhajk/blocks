const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Block = new Schema({
      _id: { type: Schema.Types.ObjectId },
      creator: { type: Schema.Types.ObjectId, ref: 'User' },
      owner: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
      /**
       * Types in order of weight
       *  - original
       *  - clone
       *  - change
       *  - hide
       *  - revision
       *  - translation
       *  - copy (get's assigned only during runtime for clone children)
       */
      type: { type: String, default: 'original' },
      
      /**
       * every block has one parent; block with no parent
       * is a top-level block
       */
      parent: { type: Schema.Types.ObjectId, ref: 'Block' },
      
      /**
       * Children is a list of all block children in sorting order
       */
      children: [{ type: Schema.Types.ObjectId, ref: 'Block' }],
      
      /**
       * this is only for clones. clones have an ancestor which
       * is the direct link to the block of which it takes
       * it's content
       */
      ancestor: { type: Schema.Types.ObjectId, ref: 'Block' },
      
      /**
       * Name is for the creator to set, so he can find the block
       * through searching or listing
       */
      name: { type: String },
      
      /**
       * the pure content of the document. only for blocks of 
       * type original and revision
       */
      content: { type: String },
      
      /**
       * content type is the type/format of the content field
       * exp: html_simple, image, heading, text, span etc.
       */
      content_type: { type: String },
      
      /**
       * properties of the block itself; diffrent properties for different
       * content_types
       * exp: document, heading size, css etc.
       * takes key:values
       */
      properties: { type: Map, of: Schema.Types.Mixed },
      
      /**
       * 
       * 
       */
      variables: { type: Map, of: String },
      /**
       * tags for searching
       */
      tags: [String],
      /**
       * language of block
       */
      language: { type: Number },
});

module.exports = mongoose.model('Block', Block);
