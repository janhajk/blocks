/*global $ */
/*global Block */
/*global Collection */

(function() {

    var collection = new Collection('mydocuments');
    collection.update();
    window.blockCollection = collection;
    
    let documentOverview = new Collection('content');
    documentOverview.thumbnailView();

})();
