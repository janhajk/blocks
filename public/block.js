/*global $ */
/*global async */
(function() {


      var Block = function _Block(_id, domParent, next) {
            this._id = (typeof _id === 'string') ? _id : '';
            this.data = {};
            this.data.creator = {};
            this.data.owner = {};
            this.data.timestamp = 0;
            this.data.type = '';
            this.data.parent = {};
            this.data.children = [];
            this.data.ancestor = {};
            this.data.content = '';
            this.data.content_type = '';
            this.data.properties = [];
            this.data.weight = 0;
            this.data.tags = [];
            this.data.language = 0;
            this.level = 0;

            // the whole dom element, rendered
            this.dom = {};
            this.domParent = domParent;
            this.contentDom = document.getElementById('content');
            var self = this;



            /*
             * Creates new block and loads it
             *
             */
            this.create = function(properties, cb) {
                  var request = new XMLHttpRequest();
                  request.open('POST', '/block/add', true);
                  request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
                  request.onload = function() {
                        if (request.status >= 200 && request.status < 405) {
                              try {
                                    let newBlock = JSON.parse(request.responseText);
                                    console.log(newBlock);
                                    return cb(null, newBlock);
                              }
                              catch (e) {
                                    console.log(e);
                                    return cb(e);
                              }
                        }
                        else {
                              console.log('Error in request; status was: ' + request.status);
                              return cb(true);
                        }
                  };
                  request.onerror = function() {
                        console.log('There was an error in xmlHttpRequest!');
                        return cb(true);
                  };
                  request.send(JSON.stringify(properties));
            };


            /*
             * Loads a block by 'id'
             *
             *
             */
            var loadById = function(id, cb) {
                  var request = new XMLHttpRequest();
                  request.open('GET', '/block/' + id, true);
                  request.onload = function() {
                        if (request.status >= 200 && request.status < 405) {
                              try {
                                    var block = JSON.parse(request.responseText);
                                    console.log(block);
                                    return cb(null, block);
                              }
                              catch (e) {
                                    console.log(e);
                                    return cb(e);
                              }
                        }
                        // status error
                        else {
                              console.log('Error in request; status was: ' + request.status);
                              return cb(true);
                        }
                  };
                  // connection error
                  request.onerror = function(e) {
                        console.log('There was an error in xmlHttpRequest!');
                        return cb(e);
                  };
                  request.send();
            };
            this.loadById = loadById;


            /*
             * Load block data
             
             * this is recursive as it loads all the children within
             *
             * TODO: load 
             */
            var load = function(next) {
                  loadById(self._id, function(e, block) {
                        // remove old data
                        if (self.dom.row !== undefined) self.contentDom.removeChild(self.dom.row);
                        self.data.children = [];
                        // set new data
                        for (let i in block) {
                              self.data[i] = block[i];
                        }
                        // Children must be reversed in order, because they are added from bottom to top through isertAdjacentElement
                        // can't use reverse() because it changes input array, so make a copy
                        let childrenReverse = [];
                        for (let i in self.data.children) {
                              childrenReverse.unshift(self.data.children[i]);
                        }

                        // Render DOM of block
                        self.render();
                        // Top Block get's appended to content of page
                        if (self._id === window.currentBlockId) {
                              while (self.contentDom.firstChild) {
                                    self.contentDom.removeChild(self.contentDom.firstChild);
                              }
                              self.contentDom.appendChild(self.dom.row);
                        }
                        else {
                              // Blocks are inserted from bottom to top; that's why they are processed in reverse order
                              // ToDo: This ends up to be very slow; must implement way to order
                              self.domParent.insertAdjacentElement('afterend', self.dom.row);
                        }
                        // Add content to Block-DOM-Element
                        self.dom.body.innerHTML = self.data.content;
                        // Go trough all children and load them
                        // Limit 1/serial loading is important, or the order can get messed up, because on might load faster than the other
                        async.eachOfLimit(childrenReverse, 1, function(childId, key, callback) {
                                    self.data.children[key] = new _Block(childId, self.dom.row);
                                    self.data.children[key].level = self.level + 1;
                                    self.data.children[key].load(function() {
                                          callback(); // report child loaded
                                    });
                              },
                              // when async finishes
                              function(e) {
                                    return next(); // report block and children loaded
                              });
                  });

            };
            this.load = load;


            var saveContent = function(next) {
                  var params = {
                        content: self.content,
                        _id: self._id
                  };
                  var request = new XMLHttpRequest();
                  request.open('POST', '/block/save', true);
                  request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
                  request.onload = function() {
                        if (request.status >= 200 && request.status < 405) {
                              try {
                                    var response = JSON.parse(request.responseText);
                                    console.log(response);
                                    return next(null, response);
                              }
                              catch (e) {
                                    console.log(e);
                                    return next(e);
                              }
                        }
                        else {
                              console.log('Error in request; status was: ' + request.status);
                              return next(true);
                        }
                  };
                  request.onerror = function() {
                        console.log('There was an error in xmlHttpRequest!');
                        return next(true);
                  };
                  request.send(JSON.stringify(params));
            };
            this.saveContent = saveContent;

            var append = function(blockToAppend, next) {
                  blockToAppend.render();
                  let whereToAppend = findLastNChild(self);
                  blockToAppend.level = self.level + 1;
                  whereToAppend.dom.row.insertAdjacentElement('afterend', blockToAppend.dom.row);
                  self.data.children.push(blockToAppend);
                  blockToAppend.dom.row.scrollIntoView();
                  return next();
            };
            this.append = append;

            this.remove = function(next) {
                  var params = {
                        _id: self._id
                  };
                  var request = new XMLHttpRequest();
                  request.open('POST', '/block/remove', true);
                  request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
                  request.onload = function() {
                        if (request.status >= 200 && request.status < 405) {
                              try {
                                    var response = JSON.parse(request.responseText);
                                    console.log(response);
                                    return next(null, response);
                              }
                              catch (e) {
                                    console.log(e);
                                    return next(e);
                              }
                        }
                        else {
                              console.log('Error in request; status was: ' + request.status);
                              return next(true);
                        }
                  };
                  request.onerror = function() {
                        console.log('There was an error in xmlHttpRequest!');
                        return next(true);
                  };
                  request.send(JSON.stringify(params));
            };

            this.render = function() {
                  let panel = new this.blockPanel(self);
                  let row = panel.content.row;
                  let body = panel.content.body;
                  let panelDom = panel.content.panel;
                  self.dom.body = body;
                  self.dom.row = row;
                  self.dom.panel = panelDom;
            };



            var findLastNChild = function _findLastNChild(block) {
                  let childrenCount = block.data.children.length;
                  if (childrenCount === 0) {
                        return block;
                  }
                  let lastChild = block.data.children[childrenCount - 1];
                  return _findLastNChild(lastChild);
            };
            this.findLastNChild = findLastNChild;



            // new Block (alternatively string is given which is a _id)
            // object contains properties for new block
            if (typeof _id === 'object') {
                  let properties = _id;
                  this.create(properties, function(e, newBlockData) {
                        self._id = newBlockData._id;
                        for (let i in newBlockData) {
                              self.data[i] = newBlockData[i];
                        }
                        next(self);
                  });
            }


      };

      Block.fn = Block.prototype = {

      };

      window.Block = Block;

})();
