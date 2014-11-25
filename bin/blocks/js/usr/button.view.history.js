var buttonHistory = function(type,title,target) {
  buttonHistory.parent.init.call(this,type,title,target,'h');
};
buttonHistory.prototype             = new oButton();
buttonHistory.prototype.constructor = oButton;
buttonHistory.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonHistory.prototype.click = function() {
  l.data.data[l.data.selected].loadHistory();
};


liste.prototype.loadDiff = function(){
  var items, col;
  $('#middle').empty();
  this.createCol(0);
  $('#level0').enableSelection();
  $('#level0').css({'width':'100%'});
  // Einträge laden
  col = '#level0-content';
  items = this.data.data[this.data.selected].renderHistory();
  this.contentList(col, items);
};