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

    app.get('/documents/add', /*auth.ensureAuthenticated,*/ function(req, res) {
        block.add({type:'document'}, function(e, block) {
            res.send(e ? e : block);
        });
    });
    app.get('/documents/:id/load', /*auth.ensureAuthenticated,*/ function(req, res) {
        const id = req.params.id;
        block.getById(id, function(e, block) {
            res.send(e ? e : block);
        });
    });


};

exports.basic = basic;