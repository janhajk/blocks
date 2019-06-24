// User Config File
var config = require(__dirname + '/config.js');

var utils = require(__dirname + '/utils.js');
var auth = require(__dirname + '/auth.js');

var block = require(__dirname + '/lib/blocks.js');


// System
var fs = require('fs');


var basic = function(app, connection) {
    app.get('/', function(req, res) {
        fs.readFile(__dirname + '/public/index.html', 'utf-8', function(e, data) {
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
    app.get('/documents/:limit', /*auth.ensureAuthenticated,*/ function(req, res) {
        utils.log('loading all top level blocks...');
        const limit = parseInt(req.params.limit,10);
        block.getTop(limit, function(e, blocks) {
            res.send(e ? e : blocks);
        });
    });
    app.get('/block/all', /*auth.ensureAuthenticated,*/ function(req, res) {
        utils.log('loading all blocks...');
        block.all(function(e, blocks) {
            res.send(e ? e : blocks);
        });
    });
    app.get('/block/byNameAndTag', /*auth.ensureAuthenticated,*/ function(req, res) {
        utils.log('loading blocks by name and tag...');
        block.byNameAndTag(function(e, blocks) {
            res.send(e ? e : blocks);
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
    app.get('/block/pdf/:id', /*auth.ensureAuthenticated,*/ function(req, res) {
        const id = req.params.id;
        const pdf = require(__dirname + '/lib/pdf.js');
        pdf.output(id, res);
    });
    app.get('/block/:id', /*auth.ensureAuthenticated,*/ function(req, res) {
        const id = req.params.id;
        block.getById(id, function(e, block) {
            res.send(e ? e : block);
        });
    });

};

exports.basic = basic;
