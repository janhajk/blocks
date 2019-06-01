/*global $ */
/*global Block */

(function() {

    var currentBlockId = '';
    currentBlockId = '5cefd7185aa420404caf7628';
    window.currentBlockId = currentBlockId;
    var b = new Block(currentBlockId, document.getElementById('content'));
    b.load(function() {
        console.log('success, fallowing your block:');
        console.log(b);
    });

})();
