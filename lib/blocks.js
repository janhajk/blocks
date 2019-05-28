// User Config File
var config = require(__dirname + '/../config.js');
var utils = require(__dirname + '/../utils.js');

var async = require('async');






/**
 * Add a new block to the database
 * 
 */
var add = function(properties, cb) {
      var Block = require(__dirname + '/../models/block.js');
      var data = {
            // 'creatorId': 0,
            // 'owner': 0,
            'timestamp': +new Date(),
            'type': (properties.type !== undefined ? properties.type : 'text'),
            'children': [], // new block will never have children
            'content': '', // new block will have no content yet
            'content_type': (properties.content_type !== undefined ? properties.content_type : 'html'),
            'properties': [],
            'weight': 0,
            'language': 0
      };
      var block = new Block(data);
      // Add parent
      // 'parent': (properties.parent !== undefined ? properties.parent : 0)
      // Add Ancestor
      // 'ancestor': (properties.ancestor !== undefined ? properties.ancestor : 0), // for clones
      block.save(function(err, block) {
            if (err) {
                  console.error(err);
                  return cb(err);
            }
            return cb(null, block);
      });
};
exports.add = add;

var getById = function(id, cb) {
      var Block = require(__dirname + '/models/block.js');
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
var edit = function(properties, connection, cb) {

};
exports.edit = edit;
