/*global $ */
/*global async */
/*global $B */
(function() {

      const req = function(params, next) {
            if (params.method === undefined) { params.method = 'GET' }
            var request = new XMLHttpRequest();
            request.open(params.method, params.url, true);
            if (params.method === 'POST' || params.method === 'PUT') request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
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
            if (params.method === 'POST' || params.method === 'PUT' || params.method === 'DELETE') {
                  request.send(JSON.stringify(params.data));
            }
            else {
                  request.send();
            }
      };


      /**
       * Goes through a block and all of it's children and returns the block that matches the id
       * 
       */
      const findBlockById = function _findBlockById(id, block) {
            if (block._id === id) {
                  return block;
            }
            for (let i = 0; i < block.data.children.length; i++) {
                  let curBlock = _findBlockById(id, block.data.children[i]);
                  if (curBlock) {
                        return curBlock;
                  }
            }
            return false;
      };


      var Block = function _Block(_id, next) {
            this._id = (typeof _id === 'string') ? _id : ''; // this id may be changed i.e clones will get a new _id during runtime
            // set default data
            this.data = {
                  _id: (typeof _id === 'string') ? _id : '', // original _id; unchangable
                  creator: {},
                  owner: {},
                  timestamp: 0,
                  type: '',
                  parent: '',
                  children: [],
                  ancestor: '',
                  content: '',
                  content_type: '',
                  properties: [],
                  variables: {},
                  weight: 0,
                  tags: [],
                  language: 0
            };
            this.level = 0;
            this.isClone = false;

            // the whole dom element, rendered
            this.dom = {};
            // the dom element, where the document is rendered into
            this.contentDom = document.getElementById('content');

            var self = this;


            /*
             * Creates new block and loads it
             *
             */
            this.create = function(properties, next) {
                  req({
                              url: '/block/add',
                              data: properties,
                              method: 'POST'
                        },
                        function(e, newBlock) {
                              return next(e, newBlock);
                        });
            };


            /*
             * Loads a block by its 'id'
             *
             *
             */
            let loadById = function(id, next) {
                  req({
                              url: '/block/' + id,
                              method: 'GET'
                        },
                        function(e, block) {
                              next(e, block);
                        });
            };
            this.loadById = loadById;


            /**
             * Load block
             * 
             * request to server to get block data
             * then create Block object
             * load childrend as Block objects
             * load clones
             * 
             * this is recursive as it loads all the children within
             *
             * 
             */
            var load = function(next, isClone) {
                  if (isClone === undefined) isClone = false; // default is no clone
                  // using data._id as original _id (not self._id which contains changable _id)
                  loadById(self.data._id, function(e, block) {
                        self.data.children = [];
                        // Clones keeps parent and type, because it get's reassigned before getting to this point
                        if (isClone) {
                              delete block.parent;
                              delete block.type;
                              delete block.variables;
                        }
                        // set new data
                        for (let i in block) {
                              if (block.hasOwnProperty(i)) {
                                    self.data[i] = block[i];
                              }
                        }
                        self.isClone = isClone;
                        async.parallel([
                              /**
                               * Go trough all children and load them
                               */
                              function(callback) {
                                    async.eachOf(self.data.children,
                                          function(childId, key, callback) {
                                                self.data.children[key] = new _Block(childId);
                                                self.data.children[key].level = self.level + 1;
                                                // Copy variables from parent; overwrite own variables
                                                for (let i in self.data.variables) {
                                                      if (self.data.variables.hasOwnProperty(i)) {
                                                            self.data.children[key].data.variables[i] = self.data.variables[i];
                                                      }
                                                }
                                                // If clone, we need to use new assigned parent and _id
                                                if (isClone) {
                                                      // assign new created _id and hand it down the tree as parent
                                                      self.data.children[key].data.parent = self._id;
                                                      // new id = 'parentId'_'blockId'
                                                      self.data.children[key]._id = self._id + '_' + childId;
                                                      self.data.children[key].data.type = 'copy';
                                                }
                                                // Prevent infinite recursion
                                                // TODO: recognize infinite recursion
                                                if (self.level > 10) {
                                                      console.log('infinite recursion');
                                                      callback();
                                                }
                                                
                                                // :RECURSION:
                                                // load child
                                                else {
                                                      self.data.children[key].load(function() {
                                                            callback(); // report child loaded
                                                      }, isClone);
                                                }
                                          },
                                          // when async finishes / all has loaded
                                          function(e) {
                                                callback(); // report block and children loaded
                                          }
                                    );
                              },
                              /**
                               * Load clone ancestor as child
                               * 
                               * Clone-IDS: all the loaded clones need new ids. This is necessary, 
                               * because clone content can be loaded multiple times in the same document.
                               * We have to make sure, that it still gets placed at the correct
                               * place.
                               * 
                               * Level: The first clone content has the same level as the owner. Because
                               * the level is used for indention and the clone element has no visual
                               * representation in the document but the clones are appended to it
                               * 
                               * Parent: The parent of the first element is changed to it's clone instead to
                               * its original parent
                               * 
                               * type: the type of the block is changed to "copy"
                               * 
                               */
                              function(callback) {
                                    if (self.data.ancestor !== '') {
                                          // Load Add ancestor as new child; store key; we need the key
                                          // in case there's also children attached to this block that
                                          // are loaded
                                          let key = self.data.children.push(new _Block(self.data.ancestor)) - 1;

                                          self.data.children[key].level = self.level;
                                          // set parent as clone owner
                                          self.data.children[key].data.parent = self._id;
                                          self.data.children[key].data.type = 'copy';
                                          self.data.children[key]._id = self._id + '_' + self.data.ancestor;
                                          // Copy variables from parent
                                          for (let i in self.data.variables) {
                                                if (self.data.variables.hasOwnProperty(i)) {
                                                      self.data.children[key].data.variables[i] = self.data.variables[i];
                                                }
                                          }
                                          // :RECURSION:
                                          // load 
                                          self.data.children[key].load(function() {
                                                callback(); // report async that finished
                                          }, true);
                                    }
                                    // if block is no clone, report to async
                                    else {
                                          callback();
                                    }
                              }
                        ], function(e) {
                              next();
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
                  saveValue('content', self.data.content, function(e, res) {
                        next(e, res);
                  });
            };
            this.saveContent = saveContent;

            /**
             * Appends block to last Child of block
             * solely DOM part
             */
            var append = function(blockToAppend, next) {
                  blockToAppend.level = self.level + 1;
                  blockToAppend.render();
                  let whereToAppend = findLastNChild(self);
                  whereToAppend.dom.row.insertAdjacentElement('afterend', blockToAppend.dom.row);
                  self.data.children.push(blockToAppend);
                  // blockToAppend.dom.row.scrollIntoView();
                  return next();
            };
            this.append = append;

            /**
             * Removes the block
             */
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


            /**
             * Moves block up or down in weight. if block is already top block of children or last
             * nothing happens
             * 
             * @param string type can be either 'up' or 'down', default is down
             * 
             */
            this.move = function(type, next) {

                  // retrieve parent block
                  let parentBlock = findBlockById(this.data.parent, $B);
                  // If top block / document / no parent then don't do anything
                  if (!parentBlock) return next();
                  let siblings = parentBlock.data.children;
                  let newOrder = [];

                  // Move up
                  if (type === 'up') {
                        for (let i = 0; i < siblings.length; i++) {
                              if (i > 0 && siblings[i]._id === this._id) {
                                    let before = newOrder.splice(i - 1, 1);
                                    newOrder.push(siblings[i].data._id);
                                    newOrder.push(before[0]);
                              }
                              else {
                                    newOrder.push(siblings[i].data._id);
                              }
                        }
                  }
                  // Move down
                  else {
                        for (let i = 0; i < siblings.length; i++) {
                              if (i > 0 && siblings[i - 1]._id === this._id) {
                                    let before = newOrder.splice(i - 1, 1);
                                    newOrder.push(siblings[i].data._id);
                                    newOrder.push(before[0]);
                              }
                              else {
                                    newOrder.push(siblings[i].data._id);
                              }
                        }
                  }
                  // Save new Children order
                  parentBlock.saveValue('children', newOrder, function(e, res) {
                        next();
                  });
            };

            /**
             * creates the DOM for the block
             */
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
             * Appends the block DOM to the parent DOM (recursive with sub-blocks)
             * 
             */
            this.output = function output(block, next) {
                  let self = block;
                  // Render DOM of block
                  self.render();
                  // if top block, then clear content area
                  if (self._id === window.currentBlockId) {
                        while (self.contentDom.firstChild) {
                              self.contentDom.removeChild(self.contentDom.firstChild);
                        }
                        self.parentDom().appendChild(self.dom.row);
                  }
                  else {
                        self.parentDom().insertAdjacentElement('afterend', self.dom.row);
                  }
                  // Add content to Block-DOM-Element
                  self.dom.body.innerHTML = self.formatedContent();
                  if (self.data.type === 'clone') {
                        self.dom.body.style.color = 'gray';
                  }

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

            this.formatedContent = function() {
                  let content = '';
                  // check for content_type specific content injection
                  if (self.contentType[self.data.content_type] !== undefined && self.contentType[self.data.content_type].contentOutput !== undefined) {
                        content = self.contentType[self.data.content_type].contentOutput(self);
                  }
                  else {
                        content = self.data.content;
                  }
                  // Custom formating thorugh plugins
                  for (let i = 0; i < self.contentFormatter.length; i++) {
                        // TODO: weight
                        content = self.contentFormatter[i].format(content, self);
                  }
                  if (self.data.type === 'clone') {
                        content = '&lt;Kopie&gt;';
                  }
                  return content;
            };


            /**
             * Returns the DOM element of the blocks parent
             * 
             */
            this.parentDom = function() {
                  if (this._id === window.currentBlockId) return this.contentDom;
                  let parent = findBlockById(this.data.parent, $B);
                  if (!parent) return console.log('The Following Block has no loaded parent:'), console.log(this);
                  return parent.dom.row;
            };



            /**
             * returns block of last child of a block
             */
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
                              if (newBlockData.hasOwnProperty(i)) {
                                    self.data[i] = newBlockData[i];
                              }
                        }
                        next(self);
                  });
            }


      };

      Block.fn = Block.prototype = {

            contentType: {},
            contentFormatter: []

      };

      window.Block = Block;


})();
