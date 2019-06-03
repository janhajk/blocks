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
            var create = function(properties, cb) {
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
            this.create = create;


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
                  return next();
            };
            this.append = append;

            var remove = function(next) {
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
            this.remove = remove;


            var render = function() {
                  let panel = new Panel();
                  let row = panel.content.row;
                  let body = panel.content.body;
                  let panelDom = panel.content.panel;
                  self.dom.body = body;
                  self.dom.row = row;
                  self.dom.panel = panelDom;
            };
            this.render = render;


            var renderBlock = function(_id) {

            };
            this.renderBlock = renderBlock;


            /**
             * Creates a block panel
             * 
             * Type: Object
             * 
             * @param string title the title of the panel
             * 
             */
            var Panel = function() {
                  let summernoteProps = {
                        toolbar: [
                              ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                              ['color', ['color']],
                              ['para', ['ul', 'ol', 'paragraph']],
                              ['table', ['table']],
                              ['insert', ['link', 'picture']]
                        ]
                  };
                  let block = self;
                  let mPanel = this;
                  let menuPoints = [
                        /**
                         * 
                         * Block edit content
                         */
                        {
                              title: 'Bearbeiten',
                              icon: 'pencil',
                              action: function() {
                                    $(block.dom.body).summernote(summernoteProps);
                                    let buttonSave = document.createElement('button');
                                    buttonSave.className = 'btn btn-primary';
                                    buttonSave.setAttribute('type', 'button');
                                    buttonSave.innerHTML = 'Speichern';
                                    buttonSave.onclick = function() {
                                          block.dom.panel.removeChild(buttonSave);
                                          block.dom.panel.removeChild(buttonCancel);
                                          $(block.dom.body).summernote('destroy');
                                          block.content = block.dom.body.innerHTML;
                                          block.saveContent(function() {

                                          });
                                    };
                                    block.dom.panel.appendChild(buttonSave);
                                    let buttonCancel = document.createElement('button');
                                    buttonCancel.className = 'btn btn-primary';
                                    buttonCancel.setAttribute('type', 'button');
                                    buttonCancel.innerHTML = 'Abbrechen';
                                    buttonCancel.onclick = function() {
                                          block.dom.panel.removeChild(buttonSave);
                                          block.dom.panel.removeChild(buttonCancel);
                                          $(block.dom.body).summernote('destroy');
                                    };
                                    block.dom.panel.appendChild(buttonCancel);
                              }
                        },
                        /**
                         * Open Block
                         * 
                         */
                        {
                              title: 'Block öffnen',
                              icon: 'fullscreen',
                              action: function() {
                                    window.b = new Block(block._id, block.contentDom);
                                    window.currentBlockId = block._id;
                                    window.b.load(function() {
                                          console.log('success, fallowing your block:');
                                    });
                              }
                        },
                        // { title: 'neuen Block darüber', icon: 'angle-double-up' },
                        /**
                         * 
                         * Append new Block
                         * 
                         */
                        {
                              title: 'neuen Sub-Block anhängen',
                              icon: 'angle-double-down',
                              action: function() {
                                    new _Block({ parent: block._id }, block.dom.row, function(newBlock) {
                                          block.append(newBlock, function() {

                                          });
                                    });
                              }
                        },
                        // { title: 'Block unterordnen', icon: 'angle-double-right' },
                        { title: 'Block nach oben', icon: 'arrow-up' },
                        { title: 'Block nach unten', icon: 'arrow-down' },
                        /**
                         * 
                         * Delete/Remove block completely
                         * 
                         * 
                         */
                        {
                              title: 'Block löschen',
                              icon: 'trash',
                              action: function() {
                                    block.remove(function() {
                                          let parentBlock = findBlockById(block.data.parent, window.b);
                                          for (let i in parentBlock.data.children) {
                                                if (parentBlock.data.children[i].data._id === block.data._id) {
                                                      parentBlock.data.children.splice(i, 1);
                                                      break;
                                                }
                                          }
                                          block.contentDom.removeChild(block.dom.row);
                                    });
                              }
                        }
                  ];


                  var head = function(title) {
                        let head = document.createElement('div');
                        head.className = 'ibox-head';
                        head.style.float = 'right';
                        head.style.minHeight = '0';

                        let tools = document.createElement('div');
                        tools.className = 'ibox-tools';
                        tools.style.marginRight = '10px';
                        tools.style.right = '0px';
                        tools.style.top = '0px';
                        tools.style.marginTop = '10px';
                        tools.style.borderBottom = 'none';

                        head.appendChild(tools);
                        let c = collapse();
                        let m = menu(menuPoints);
                        // tools.appendChild(c[0]);
                        tools.appendChild(m[0]);
                        tools.appendChild(m[1]);
                        return head;

                  };

                  var collapse = function() {
                        let collapse = document.createElement('a');
                        collapse.className = 'ibox-collapse';
                        let i = document.createElement('i');
                        i.className = 'ti-angle-down';
                        collapse.appendChild(i);
                        return [collapse, i];
                  };

                  var menu = function(items) {
                        let menuButton = document.createElement('a');
                        menuButton.className = 'dropdown-toggle';
                        let icon = document.createElement('i');
                        icon.className = 'ti-more-alt';
                        menuButton.appendChild(icon);
                        let menu = document.createElement('div');
                        menu.className = 'dropdown-menu dropdown-menu-right';
                        for (let i in items) {
                              let a = document.createElement('a');
                              a.className = 'dropdown-item';
                              let icon = document.createElement('i');
                              icon.className = 'ti-' + items[i].icon;
                              a.appendChild(icon);
                              a.innerHTML += items[i].title;
                              a.onclick = items[i].action;
                              menu.appendChild(a);
                        }
                        menuButton.setAttribute('data-toggle', 'dropdown');
                        //$(menuButton).dropdown('toggle');
                        return [menuButton, menu];

                  };



                  this.content = function() {
                        let div = document.createElement('div');
                        div.className = 'ibox ibox-fullheight';
                        div.style.height = 'calc(100% - 5px)';
                        div.style.marginBottom = '5px';
                        let h = head();

                        let divBody = document.createElement('div');
                        divBody.className = 'ibox-body';
                        divBody.style.padding = '5px 30px 5px';
                        divBody.style.paddingLeft = (block.level * 20 + 30) + 'px';
                        divBody.style.webkitUserSelect = 'none';
                        divBody.style.mozUserSelect = 'none';
                        divBody.style.msUserSelect = 'none';
                        divBody.style.userSelect = 'none';
                        
                        let divSlimScroll = document.createElement('div');
                        divSlimScroll.className = 'slimScrollDiv';
                        divSlimScroll.style.position = 'relative';
                        divSlimScroll.style.overflow = 'hidden';
                        divSlimScroll.style.width = 'auto';
                        divSlimScroll.style.height = '470px';
                        // divBody.appendChild(divSlimScroll);

                        div.appendChild(h);
                        div.appendChild(divBody);

                        let row = document.createElement('div');
                        row.className = 'row';
                        let col = document.createElement('div');
                        col.className = 'col-md-8';
                        row.appendChild(col);
                        col.appendChild(div);
                        return { body: divBody, row: row, panel: div };

                  }();

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


            var findBlockById = function _findBlockById(id, block) {
                  if (block.data._id === id) {
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


            // new Block (alternatively string is given which is a _id)
            // object contains properties for new block
            if (typeof _id === 'object') {
                  let properties = _id;
                  create(properties, function(e, newBlockData) {
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
