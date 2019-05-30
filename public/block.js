/*global $ */
/*global async */
(function() {


      var Block = function _Block(_id) {
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

            this.dom;





            /*
             * Creates new block and loads it
             *
             */
            var create = function(properties, cb) {
                  var self = this;
                  var params = [];
                  for (let i in properties) {
                        params.push(i + '=' + properties[i]);
                  }

                  var request = new XMLHttpRequest();
                  request.open('POST', '/block/add', true);
                  request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
                  request.onload = function() {
                        if (request.status >= 200 && request.status < 405) {
                              try {
                                    var newBlock = JSON.parse(request.responseText);
                                    console.log(newBlock);
                                    for (let i in newBlock) {
                                          self.data[i] = newBlock[i];
                                          return cb(null);
                                    }
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

            // new Block
            if (typeof _id === 'object') {
                  create(_id, function(e) {

                  });
            }

            /*
             * Loads a block 'id'
             *
             *
             */
            var loadById = function(id, cb) {
                  var self = this;
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

            // block-data is loaded; this is recursive as it loads all the children with it
            var load = function(cb) {
                  let self = this;
                  loadById(self._id, function(e, block) {
                        for (let i in block) {
                              self.data[i] = block[i];
                        }
                        async.eachOf(block.children, function(childId, key, callback) {
                                    self.data.children[key] = new _Block(childId);
                                    self.data.children[key].load(function() {
                                          callback(); // report child loaded
                                    });
                              },
                              // when async finishes
                              function(e) {
                                    return cb(); // report block and children loaded
                              });
                  });

            };
            this.load = load;

            var loadChildren = function(children) {

            };

            var render = function(parent) {

            };
            this.render = render;


            var renderBlock = function(_id) {

            };
            this.renderBlock = renderBlock;

            document.addEventListener('DOMContentLoaded', function() {
                  doc = new Panel('Werkvertrag Kanton Basel-Landschaft');

            });

            var row = function() {
                  let div = document.createElement('div');
                  div.className = 'row';
                  let col = document.createElement('div');
                  col.className = 'col';
                  div.appendChild(col);
                  return { div: div, col: col };
            };



            var Panel = function(title) {
                  var self = this;
                  this.title = {
                        value: title,
                        html: null
                  };
                  this.row = row();
                  let content = document.getElementById('content');
                  content.appendChild(this.row.div);

                  var head = function(title) {
                        let head = document.createElement('div');
                        head.className = 'ibox-head';

                        let divTitle = document.createElement('div');
                        divTitle.className = 'ibox-title';
                        divTitle.innerHTML = title;
                        self.title.html = divTitle;

                        let tools = document.createElement('div');
                        tools.className = 'ibox-tools';
                        head.appendChild(divTitle);
                        head.appendChild(tools);
                        let c = collapse();
                        let m = menu([
                              { title: 'Bearbeiten', icon: 'pencil' },
                              { title: 'Löschen', icon: 'trash' }
                        ]);
                        tools.appendChild(c[0]);
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
                              menu.appendChild(a);
                        }
                        menuButton.setAttribute('data-toggle', 'dropdown');
                        //$(menuButton).dropdown('toggle');
                        return [menuButton, menu];

                  };



                  var html = function() {
                        let div = document.createElement('div');
                        div.className = 'ibox ibox-fullheight';
                        let h = head(title);

                        let divBody = document.createElement('div');
                        divBody.className = 'ibox-body';
                        let divSlimScroll = document.createElement('div');
                        divSlimScroll.className = 'slimScrollDiv';
                        divSlimScroll.style.position = 'relative';
                        divSlimScroll.style.overflow = 'hidden';
                        divSlimScroll.style.width = 'auto';
                        divSlimScroll.style.height = '470px';
                        divBody.appendChild(divSlimScroll);
                        div.appendChild(h);
                        div.appendChild(divBody);
                        self.row.col.appendChild(div);


                  };

                  html();
            };
      };

      Block.fn = Block.prototype = {

      };

      window.Block = Block;

})();
