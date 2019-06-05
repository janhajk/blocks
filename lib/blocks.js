// User Config File
var config = require(__dirname + '/../config.js');
var utils = require(__dirname + '/../utils.js');

var async = require('async');


const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Block = require(__dirname + '/../models/block.js');


/**
 * Add a new block to the database
 * 
 */
var add = function(properties, cb) {
      var data = {
            _id: new mongoose.Types.ObjectId(),
            // 'creatorId': 0,
            // 'owner': 0,
            'type': (properties.type !== undefined ? properties.type : 'original'),
            'children': [], // new block will never have children
            'name': (properties.name !== undefined ? properties.name : 'Neuer Block erstellt am ' + (+new Date())),
            'content': (properties.content !== undefined ? properties.content : ''),
            'content_type': (properties.content_type !== undefined ? properties.content_type : 'html'),
            'tags': (properties.tags !== undefined ? properties.tags : []),
            'weight': 0,
            'language': 0
      };
      if (properties.parent !== undefined && typeof properties.parent === 'string') {
            data.parent = new mongoose.Types.ObjectId(properties.parent);
      }
      var block = new Block(data);
      block.save(function(err, block) {
            if (err) {
                  console.error(err);
                  return cb(err);
            }
            if (properties.parent !== undefined) {
                  addChildToParent(properties.parent, block._id, function() {
                        return cb(null, block);
                  });
            }
            else {
                  return cb(null, block);
            }

      });
};
exports.add = add;


/**
 * 
 * Adds a child to a parent
 * 
 */
var addChildToParent = function(parentId, childId, cb) {
      Block.findByIdAndUpdate(parentId, { $push: { children: new mongoose.Types.ObjectId(childId) } }, function(e, block) {
            console.log(block);
            return cb(block);
      });
};

var getById = function(id, cb) {
      Block.findById(id, function(e, block) {
            if (e) {
                  console.error(e);
                  return cb(e);
            }
            return cb(block);
      });
};
exports.getById = getById;


/**
 * 
 * Edit content of Block
 * 
 * 
 */
var save = function(properties, cb) {
      Block.findByIdAndUpdate(properties._id, { content: properties.content }, { new: true }, function(e, block) {
            console.log(block);
            return cb(e, block);
      });
};
exports.save = save;


/**
 * 
 * get All Top Level Blocks = Documents
 * 
 * 
 */
var getTop = function(cb) {
      Block.find({ parent: { $exists: true }}, function(e, blocks) {
            return cb(e, blocks);
      });
};
exports.getTop = getTop;


/**
 * 
 * get All  Blocks
 * 
 * 
 */
var all = function(cb) {
      Block.find().exec(function(e, blocks) {
            utils.log(blocks);
            return cb(e, blocks);
      });
};
exports.all = all;




/**
 * 
 * delete Block
 * 
 * Todo: remove all children
 */
var remove = function(properties, cb) {
      Block.findByIdAndRemove(new mongoose.Types.ObjectId(properties._id), function(e, block) {
            utils.log('Removed Block from Database...');
            if (e) return cb(e);
            Block.findByIdAndUpdate(new mongoose.Types.ObjectId(block.parent), { $pull: { children: new mongoose.Types.ObjectId(properties._id) } }, function(e, block) {
                  if (e) return cb(e);
                  utils.log('Removed child from parent...');
                  return cb(null);
            });
      });
};
exports.remove = remove;
