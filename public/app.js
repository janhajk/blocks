/*global $ */
/*global Block */

(function() {

    var currentBlockId = '';
    window.currentBlockId = currentBlockId;
    currentBlockId = '5cefd7185aa420404caf7628';
    var b = new Block(currentBlockId, document.getElementById('content'));
    b.load(function() {
        console.log('success, fallowing your block:');
        console.log(b);
    });

})();
