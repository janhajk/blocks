/*global $ */
/*global Block */

(function() {

    var currentBlockId = '';
    currentBlockId = '5cf4e39259749d3d1d9d16f3';
    window.currentBlockId = currentBlockId;
    var b = new Block(currentBlockId, document.getElementById('content'));
    b.load(function() {
        console.log('success, fallowing your block:');
        console.log(b);
    });
    window.b = b;

})();
