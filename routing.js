// User Config File
var config = require(__dirname + '/config.js');

var utils = require(__dirname + '/utils.js');
var auth = require(__dirname + '/auth.js');

var block = require(__dirname + '/lib/blocks.js');


// System
var path = require('path');
var fs = require('fs');


var basic = function(app, connection) {
    app.get('/', function(req, res) {
        fs.readFile(__dirname + '/public/index.html', 'utf-8', function(err, data) {
            res.send(data);
        });
    });

    app.post('/block/add', /*auth.ensureAuthenticated,*/ function(req, res) {
        let properties = req.body;
        utils.log(properties);
        block.add(properties, function(e, block) {
            res.send(e ? e : block);
        });
    });
    app.get('/documents', /*auth.ensureAuthenticated,*/ function(req, res) {
        utils.log('loading all top level blocks...');
        block.getTop(function(e, blocks) {
            res.send(e ? e : blocks);
        });
    });
    app.get('/block/all', /*auth.ensureAuthenticated,*/ function(req, res) {
        utils.log('loading all blocks...');
        block.all(function(e, blocks) {
            res.send(e ? e : blocks);
        });
    });
    app.get('/block/:id', /*auth.ensureAuthenticated,*/ function(req, res) {
        const id = req.params.id;
        block.getById(id, function(e, block) {
            res.send(e ? e : block);
        });
    });
    app.post('/block/save', /*auth.ensureAuthenticated,*/ function(req, res) {
        let properties = req.body;
        utils.log(properties);
        block.save(properties, function(e, block) {
            res.send(e ? { success: false, error: e } : { success: true });
        });
    });
    app.post('/block/remove', /*auth.ensureAuthenticated,*/ function(req, res) {
        let properties = req.body;
        utils.log(properties);
        block.remove(properties, function(e, block) {
            res.send(e ? { success: false, error: e } : { success: true });
        });
    });

};

exports.basic = basic;
