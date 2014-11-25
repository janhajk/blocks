var buttonBug = function(type,title,target) {  
  buttonBug.parent.init.call(this,type,title,target);
};
buttonBug.prototype             = new oButton();
buttonBug.prototype.constructor = oButton;
buttonBug.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonBug.prototype.click = function() {
  l.view = 'bugs';
  l.display();
};


liste.prototype.loadBugs = function(){
  var i, items = [], data, cids, col;
  $('#middle').empty();
  this.createCol(0);
  $('#level0').enableSelection();
  $('#level0').css({'width':'100%', 'max-width':'500px'});
  // Einträge laden
  col = '#level0-content';
  cids = this.data.getBugs();
  for (i in cids) {
    data = this.data.data[cids[i].cid];
    items.push(this.item(data.cid, data.content, 'bug'));
  } 
  this.contentList(col, items);
  this.markPath();
};

data.prototype.getBugs = function() {
  var cids = [], i;
  for (i in this.data) {
    if (this.data[i].content.search(/#bug/) !== -1) {cids.push({cid:i, weight:this.data[i].weight});}
  }
  cids.sort(function(a,b) {return a.weight - b.weight;});
  return cids;
};