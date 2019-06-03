/*global $ */
/*global Block */

(function() {

    var currentBlockId = '';
    currentBlockId = '5cf510135dfa064cd93aef58';
    window.currentBlockId = currentBlockId;
    var b = new Block(currentBlockId, document.getElementById('content'));
    b.load(function() {
        console.log('success, fallowing your block:');
        console.log(b);
    });
    window.b = b;

})();
