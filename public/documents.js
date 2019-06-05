/*global Block*/
(function() {


      let Collection = function(domParent) {

            domParent = document.getElementById('mydocuments');


            /*
             * loads all user documents
             *
             */
            this.load = function(cb) {
                  var request = new XMLHttpRequest();
                  request.open('GET', '/documents', true);
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


            this.update = function() {
                  this.load(function(blocks) {
                        // Clear list
                        while (domParent.firstChild) {
                              domParent.removeChild(domParent.firstChild);
                        }
                        this.render(blocks);
                  });

            };

            this.render = function(blocks) {
                  for (let i = 0; i < blocks.length; i++) {
                        let li = document.createElement('li');
                        let a = document.createElement('a');
                        a.href = 'javascript:;';
                        let _id = blocks[i]._id;
                        a.onclick = function() {
                              window.b = new Block(_id, document.getElementById('content'));
                              window.currentBlockId = _id;
                              window.b.load(function() {
                                    console.log('success!');
                              });
                        };
                        a.innerHTML = blocks[i].name;
                        li.appendChild(a);
                        domParent.appendChild(li);
                  }
            };
      };
      
      
      Collection.fn = Collection.prototype = {

      };

      window.Collection = Collection;


}());
