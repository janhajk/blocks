/**
 * Extends: liste
 * Mobile View
 */
liste.prototype.loadMobile = function(){
  var i, items = [], data, cids, col;
  $('#middle').empty();
  this.createCol(0);
  $('#level0').enableSelection();
  $('#level0').css({'width':'100%'});
  // Einträge laden
  col = '#level0-content';
  if (this.data.selected === 0) {
    cids = this.data.getSiblings(92);
  }
  else {
    cids = this.data.data[this.data.selected].children[0].concat(this.data.data[this.data.selected].children[1]);
  }
  for (i in cids) {
    data = (this.data.selected === 0) ? this.data.data[cids[i].cid] : this.data.data[cids[i]];
    items.push(this.item(data.cid, data.content, 'mobile'));
  }
  this.contentList(col, items);
  new button('up', 'Up in the tree', 'level0 ul:first', 'prepend');
};
