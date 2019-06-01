/*global $ */
/*global Block */

(function() {

    var currentBlockId = '';
    currentBlockId = '5cf24caa02a03f420878aa2a';
    window.currentBlockId = currentBlockId;
    var b = new Block(currentBlockId, document.getElementById('content'));
    b.load(function() {
        console.log('success, fallowing your block:');
        console.log(b);
    });

})();
