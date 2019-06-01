/*global $ */
/*global async */
(function() {


      var Block = function _Block(_id, domParent) {
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
                                    var newBlock = JSON.parse(request.responseText);
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

            // new Block (alternatively string is given which is a _id)
            // object contains properties for new block
            if (typeof _id === 'object') {
                  create(_id, function(e, newBlock) {
                        for (let i in newBlock) {
                              self.data[i] = newBlock[i];
                        }
                  });
            }

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
                        self.children = [];
                        // set new data
                        for (let i in block) {
                              self.data[i] = block[i];
                        }
                        self.render();
                        if (self._id === window.currentBlockId) {
                              self.contentDom.appendChild(self.dom.row);
                        }
                        else {
                              let sibling = self.domParent.nextElementSibling;
                              if (sibling !== null) {
                                    self.domParent.insertBefore(self.dom.row, self.domParent.nextElementSibling);
                              }
                              else {
                                    self.domParent.parentNode.append(self.dom.row);
                              }
                        };
                        self.dom.body.innerHTML = self.data.content;
                        // Go trough all children and load them
                        async.eachOf(block.children, function(childId, key, callback) {
                                    self.data.children[key] = new _Block(childId, self.dom.row);
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

            var appendBlock = function(next) {
                  var params = {
                        parent: self._id
                  };
                  var request = new XMLHttpRequest();
                  request.open('POST', '/block/add', true);
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
            this.appendBlock = appendBlock;


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
                                    // ToDo: Save Button: https://github.com/DiemenDesign/summernote-save-button/blob/master/summernote-save-button.js
                                    let buttonSave = document.createElement('button');
                                    buttonSave.className = 'btn btn-primary';
                                    buttonSave.setAttribute('type', 'button');
                                    buttonSave.innerHTML = 'Speichern';
                                    buttonSave.onclick = function() {
                                          block.dom.panel.removeChild(buttonSave);
                                          $(block.dom.body).summernote('destroy');
                                          block.content = block.dom.body.innerHTML;
                                          block.saveContent(function() {

                                          });
                                    };
                                    block.dom.panel.appendChild(buttonSave);
                              }
                        },
                        { title: 'neuen Block darüber', icon: 'angle-double-up' },
                        {
                              title: 'neuen Block darunter',
                              icon: 'angle-double-down',
                              action: function() {
                                    block.create({ parent: block._id }, function(e, newBlock) {
                                          block.load(function() {

                                          });
                                    });
                              }
                        },
                        { title: 'Block unterordnen', icon: 'angle-double-right' },
                        { title: 'Block nach oben', icon: 'arrow-up' },
                        { title: 'Block nach unten', icon: 'arrow-down' },
                        { title: 'Block löschen', icon: 'trash' }
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

                        let divSlimScroll = document.createElement('div');
                        divSlimScroll.className = 'slimScrollDiv';
                        divSlimScroll.style.position = 'relative';
                        divSlimScroll.style.overflow = 'hidden';
                        divSlimScroll.style.width = 'auto';
                        divSlimScroll.style.height = '470px';
                        divBody.appendChild(divSlimScroll);

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
      };

      Block.fn = Block.prototype = {

      };

      window.Block = Block;

})();
