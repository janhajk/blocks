/*global Block*/
(function() {


      // Create new Document link
      let linkNewDocument = document.getElementById('linkNewDocument');
      linkNewDocument.onclick = function() {
            new Block({ content_type: 'document', content: 'Neues Dokument' }, function(newBlock) {
                  window.$B = newBlock;
                  window.currentBlockId = newBlock._id;
                  window.$B.load(function() {
                        window.$B.output(window.$B, function() {
                              window.blockCollection.update();
                        });
                  });
            });
      };


      let Collection = function(domParent) {

            domParent = document.getElementById(domParent);


            /*
             * loads all user documents
             *
             */
            this.load = function(limit, cb) {
                  var request = new XMLHttpRequest();
                  request.open('GET', '/documents/' + limit, true);
                  request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
                  request.onload = function() {
                        if (request.status >= 200 && request.status < 405) {
                              try {
                                    let blocks = JSON.parse(request.responseText);
                                    console.log(blocks);
                                    return cb(null, blocks);
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
                  request.send();
            };

            this.render = function(blocks) {
                  // Show all documents Link
                  let li = document.createElement('li');
                  let a = document.createElement('a');
                  a.href = 'javascript:;';
                  a.onclick = function() {
                            new Collection('content').thumbnailView();
                  };
                  a.innerHTML = 'Alle Dokumente anzeigen';
                  li.appendChild(a);
                  domParent.appendChild(li);
                  
                  for (let i = 0; i < blocks.length; i++) {
                        let li = document.createElement('li');
                        let a = document.createElement('a');
                        a.href = 'javascript:;';
                        let _id = blocks[i]._id;
                        a.onclick = function() {
                              window.$B = new Block(_id);
                              window.currentBlockId = _id;
                              window.$B.load(function() {
                                    window.$B.output(window.$B, function() {
                                          console.log('success!');
                                    });
                              });
                        };
                        a.innerHTML = blocks[i].name;
                        li.appendChild(a);
                        domParent.appendChild(li);
                  }
                  

            };

            this.update = function() {
                  let self = this;
                  this.load(6, function(error, blocks) {
                        // Clear list
                        while (domParent.firstChild) {
                              domParent.removeChild(domParent.firstChild);
                        }
                        self.render(blocks);
                  });

            };


            this.thumbnailView = function() {
                  let thumbsPerRow = 6;

                  // Clear list
                  while (domParent.firstChild) {
                        domParent.removeChild(domParent.firstChild);
                  }

                  let thumb = function(block) {
                        const textLength = 100;
                        // div Container
                        let div = document.createElement('div');
                        div.className = 'ibox ibox-fullheight';
                        div.style.height = 'calc(100% - 5px)';
                        div.style.marginBottom = '5px';
                        div.style.cursor = 'pointer';

                        // Body div with content in innerHTML
                        let divBody = document.createElement('div');
                        divBody.className = 'ibox-body';
                        divBody.style.padding = '5px 30px 5px';

                        // Make none selectable
                        divBody.style.webkitUserSelect = 'none';
                        divBody.style.mozUserSelect = 'none';
                        divBody.style.msUserSelect = 'none';
                        divBody.style.userSelect = 'none';

                        // Oben block  when clicking
                        divBody.onclick = function() {
                              // open document
                              window.$B = new Block(block._id);
                              window.currentBlockId = block._id;
                              window.$B.load(function() {
                                    window.$B.output(window.$B, function() {});
                              });
                        };

                        divBody.innerHTML = block.content.substring(0, textLength) + (block.content.length >= textLength ? '...' : '');

                        div.appendChild(divBody);

                        // Panel container as bootstrap grid row
                        let row = document.createElement('div');
                        row.className = 'row';
                        let col = document.createElement('div');
                        col.className = 'col-md-' + (12 / thumbsPerRow);
                        row.appendChild(col);
                        col.appendChild(div);
                        return col;

                  };
                  let row = document.createElement('div');
                  row.className = 'row';
                  this.load(50, function(error, blocks) {
                        for (let i in blocks) {
                              row.appendChild(thumb(blocks[i]));
                              if ((i + 1) % thumbsPerRow === 0) {
                                    domParent.appendChild(row);
                                    row = document.createElement('div');
                                    row.className = 'row';
                              }
                        }
                        if (blocks.length % thumbsPerRow !== 0) domParent.appendChild(row);
                  });
            };


      };


      Collection.fn = Collection.prototype = {

      };

      window.Collection = Collection;


}());
