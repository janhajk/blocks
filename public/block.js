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


      /**
       * Goes through a block and all of it's children and returns the block that matches the id
       * 
       */
      const findBlockById = function _findBlockById(id, block) {
            if (block._id === id) {
                  return block;
            }
            for (let i in block.data.children) {
                  let curBlock = _findBlockById(id, block.data.children[i]);
                  if (curBlock) {
                        return curBlock;
                  }
            }
            return false;
      };


      var Block = function _Block(_id, next) {
            this._id = (typeof _id === 'string') ? _id : '';
            this.data = {};
            this.data._id = (typeof _id === 'string') ? _id : '';
            this.data.creator = {};
            this.data.owner = {};
            this.data.timestamp = 0;
            this.data.type = '';
            this.data.parent = '';
            this.data.children = [];
            this.data.ancestor = '';
            this.data.content = '';
            this.data.content_type = '';
            this.data.properties = [];
            this.data.weight = 0;
            this.data.tags = [];
            this.data.language = 0;
            this.level = 0;
            this.isClone = false;

            // the whole dom element, rendered
            this.dom = {};
            this.contentDom = document.getElementById('content');
            var self = this;


            // Create new Document link
            let linkNewDocument = document.getElementById('linkNewDocument');
            linkNewDocument.onclick = function() {
                  new Block({ content_type: 'document', content: 'Neues Dokument' }, function(newBlock) {
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
                              url: '/block/add',
                              method: 'POST'
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


            /**
             * Load block data
             * 
             * this is recursive as it loads all the children within
             * loads clones
             *
             * 
             */
            var load = function(next, isClone) {
                  if (isClone === undefined) isClone = false;
                  loadById(self.data._id, function(e, block) {
                        self.data.children = [];
                        if (isClone) {
                              delete block.parent;
                        }
                        // set new data
                        for (let i in block) {
                              self.data[i] = block[i];
                        }
                        self.isClone = isClone;
                        async.parallel([
                              // Go trough all children and load them
                              // Limit 1/serial loading is important, or the order can get messed up, because on might load faster than the other
                              function(callback) {
                                    async.eachOf(self.data.children,
                                          function(childId, key, callback) {
                                                self.data.children[key] = new _Block(childId);
                                                self.data.children[key].level = self.level + 1;
                                                // If clone, we need to use new assigned parent and _id
                                                if (isClone) {
                                                      self.data.children[key].data.parent = self._id;
                                                      self.data.children[key]._id = self._id + '_' + childId;
                                                }
                                                self.data.children[key].load(function() {
                                                      callback(); // report child loaded
                                                }, isClone);
                                          },
                                          // when async finishes / all has loaded
                                          function(e) {
                                                callback(); // report block and children loaded
                                          }
                                    )
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
                               * Parent: The parent of the first element is changed to it's clone 
                               * 
                               * owner
                               */
                              function(callback) {
                                    if (self.data.ancestor !== '') {
                                          // Load Add ancestor as new child
                                          self.data.children.push(new _Block(self.data.ancestor));

                                          self.data.children[0].level = self.level;
                                          // set parent as clone owner
                                          self.data.children[0].data.parent = self._id;
                                          self.data.children[0]._id = self._id + '_' + self.data.ancestor;
                                          // load 
                                          self.data.children[0].load(function() {
                                                callback();
                                          }, true);
                                    }
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
                  // check for content_type specific content injection
                  if (self.contentType[self.data.content_type] !== undefined && self.contentType[self.data.content_type].content !== undefined) {
                        self.dom.body.innerHTML = self.contentType[self.data.content_type].content(self);
                  }
                  else {
                        self.dom.body.innerHTML = self.data.content;
                  }
                  if (self.data.type === 'clone') {
                        self.dom.body.innerHTML = '&lt;Kopie&gt;';
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

            this.parentDom = function() {
                  if (this._id === window.currentBlockId) return this.contentDom;
                  let parent = findBlockById(this.data.parent, window.b);
                  if (!parent) return console.log('The Following Block has no loaded parent'), console.log(this);
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
                              self.data[i] = newBlockData[i];
                        }
                        next(self);
                  });
            }


      };

      Block.fn = Block.prototype = {

            contentType: {}

      };

      window.Block = Block;

})();
