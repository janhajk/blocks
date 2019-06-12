/*global Block*/

(function() {


      Block.fn.contentType.heading = {
            contentOutput: function(block) {
                  return '<h' + (block.level + 2) + '>' + block.data.content + '</h' + (block.level + 2) + '>';
            }

      };



}());
