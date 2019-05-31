/*global $ */
/*global Block */

(function() {

    var currentBlockId = 0;
    window.currentBlockId = currentBlockId;

    var b = new Block('5cefd7185aa420404caf7628', document.getElementById('content'));
    b.load(function() {
        console.log('success');
    });

})();
