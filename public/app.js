/*global $ */
/*global Block */

(function() {

    var currentBlockId = '';
    currentBlockId = '5cf4e79fc74bd53f130925d8';
    window.currentBlockId = currentBlockId;
    var b = new Block(currentBlockId, document.getElementById('content'));
    b.load(function() {
        console.log('success, fallowing your block:');
        console.log(b);
    });
    window.b = b;

})();
