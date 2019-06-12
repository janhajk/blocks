/*global Block*/

(function() {


      Block.fn.contentType.heading = {
            content: function(block) {
                  return '<h' + (block.level + 2) + '>' + block.data.content + '</h' + (block.level + 2) + '>';
            }

      };



}());
