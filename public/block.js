/*global $ */
/*global async */
(function() {

      const req = function(params, next) {
            if (params.method === undefined) { params.method = 'GET' }
            var request = new XMLHttpRequest();
            request.open(params.method, params.url, true);
            if (params.method === 'POST') request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
            request.onload = function() {
                  if (request.status >= 200 && request.status < 405) {
                        try {
                              var json = JSON.parse(request.responseText);
                              // console.log(json);
                              return next(null, json);
                        }
                        catch (e) {
                              console.log(e);
                              return next(e);
                        }
                  }
                  // status error
                  else {
                        console.log('Error in request; status was: ' + request.status);
                        return next(true);
                  }
            };
            // connection error
            request.onerror = function(e) {
                  console.log('There was an error in xmlHttpRequest!');
                  return next(e);
            };
            if (params.method === 'POST') {
                  request.send(JSON.stringify(params.data));
            }
            else {
                  request.send();
            }
      };


      var Block = function _Block(_id, domParent, next) {
            this._id = (typeof _id === 'string') ? _id : '';
            this.data = {};
            this.data.creator = {};
            this.data.owner = {};
            this.data.timestamp = 0;
            this.data.type = '';
            this.data.parent = '';
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


            // Create new Document link
            let linkNewDocument = document.getElementById('linkNewDocument');
            linkNewDocument.onclick = function() {
                  new Block({ content_type: 'document', content: 'Neues Dokument' }, document.getElementById('content'), function(newBlock) {
                        window.b = newBlock;
                        window.currentBlockId = newBlock._id;
                        window.b.load(function() {
                              window.b.output(window.b, function() {
                                    window.blockCollection.update();
                              });
                        });
                  });
            };



            /*
             * Creates new block and loads it
             *
             */
            this.create = function(properties, next) {
                  req({
                              data: properties,
                              url: '/block/add'
                        },
                        function(e, newBlock) {
                              return next(e, newBlock);
                        });
            };


            /*
             * Loads a block by 'id'
             *
             *
             */
            var loadById = function(id, next) {
                  req({ url: '/block/' + id }, function(e, block) {
                        next(e, block);
                  });
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
                        self.data.children = [];
                        // set new data
                        for (let i in block) {
                              self.data[i] = block[i];
                        }
                        // Render DOM of block
                        self.render();
                        // Go trough all children and load them
                        // Limit 1/serial loading is important, or the order can get messed up, because on might load faster than the other
                        async.eachOf(self.data.children, function(childId, key, callback) {
                                    self.data.children[key] = new _Block(childId, self.dom.row);
                                    self.data.children[key].level = self.level + 1;
                                    self.data.children[key].load(function() {
                                          callback(); // report child loaded
                                    });
                              },
                              // when async finishes / all has loaded
                              function(e) {
                                    next(); // report block and children loaded
                              });
                  });
            };
            this.load = load;


            var saveValue = function(field, value, next) {
                  req({
                              url: '/block/save',
                              method: 'POST',
                              data: {
                                    _id: self._id,
                                    field: field,
                                    value: value
                              }
                        },
                        function(e, response) {
                              next(e, response);
                        });
            };
            this.saveValue = saveValue;


            var saveContent = function(next) {
                  saveValue('content', self.content, function(e, res) {
                        next(e, res);
                  });
            };
            this.saveContent = saveContent;

            var append = function(blockToAppend, next) {
                  blockToAppend.render();
                  let whereToAppend = findLastNChild(self);
                  blockToAppend.level = self.level + 1;
                  whereToAppend.dom.row.insertAdjacentElement('afterend', blockToAppend.dom.row);
                  self.data.children.push(blockToAppend);
                  // blockToAppend.dom.row.scrollIntoView();
                  return next();
            };
            this.append = append;

            this.remove = function(next) {
                  req({
                        url: '/block/remove',
                        method: 'POST',
                        data: {
                              _id: self._id
                        }
                  }, function(e, res) {
                        next(e, res);
                  });
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

            /**
             * Appends the block to the parent DOM (recursive with sub-blocks)
             * 
             */
            this.output = function output(block, next) {
                  let self = block;
                  // remove old dom
                  // if (self.dom.row !== undefined) self.contentDom.removeChild(self.dom.row);
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
                  // Children must be reversed in order, because they are added from bottom to top through isertAdjacentElement
                  // can't use reverse() because it changes input array, so make a copy
                  let childrenReverse = [];
                  for (let i = 0; i < self.data.children.length; i++) {
                        childrenReverse.unshift(self.data.children[i]);
                  }
                  async.eachLimit(childrenReverse, 1, function(childBlock, callback) {
                              output(childBlock, function() {
                                    callback(); // report child loaded
                              });
                        },
                        // when async finishes / all has loaded
                        function(e) {
                              return next(); // report block and children loaded
                        });
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
