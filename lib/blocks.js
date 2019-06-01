// User Config File
var config = require(__dirname + '/../config.js');
var utils = require(__dirname + '/../utils.js');

var async = require('async');


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Block = require(__dirname + '/../models/block.js');


/**
 * Add a new block to the database
 * 
 */
var add = function(properties, cb) {
      var data = {
            _id: new mongoose.Types.ObjectId(),
            parent: new mongoose.Types.ObjectId(typeof properties.parent === 'string' ? properties.parent : undefined),
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
 * Edit Block
 * 
 * 
 */
var save = function(properties, cb) {
      Block.findByIdAndUpdate(properties._id, { content: properties.content }, function(e, block) {
            console.log(block);
            return cb(block);
      });
};
exports.save = save;
