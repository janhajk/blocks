var buttonLinethrough = function(type,title,target) {  
  buttonLinethrough.parent.init.call(this,type,title,target);
};
buttonLinethrough.prototype             = new oButton();
buttonLinethrough.prototype.constructor = oButton;
buttonLinethrough.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonLinethrough.prototype.click = function() {
  l.view = 'linethrough';
  l.display();
};

/**
 * Liste Erweiterung
 */
liste.prototype.loadLinethrough = function(){
  var i, items = [], cids;
  $('#middle').empty();
  this.createCol(0);
  $('#level0').enableSelection().css({'width':'100%', 'max-width':'500px'});
  cids = this.data.getLinethrough();
  for (i in cids) {
    items.push(l.data.data[cids[i].cid].render()); // Durchstreichen
  } 
  this.contentList('#level0-content', items);
  this.markPath();
};

/**
 * Data Erweiterung
 * Gibt alle Einträge, welche Active = 0 haben, also inaktiv/durchgestrichen sind
 */
data.prototype.getLinethrough = function() {
  var cids = [], i;
  for (i in this.data) {
    this.data[i].active === 0 && cids.push({cid:i, weight:this.data[i].weight});
  }
  return cids.sort(function(a,b) {return a.weight - b.weight;});
};