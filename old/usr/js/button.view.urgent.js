var buttonUrgent = function(type,title,target) {  
  buttonUrgent.parent.init.call(this,type,title,target);
};
buttonUrgent.prototype             = new oButton();
buttonUrgent.prototype.constructor = oButton;
buttonUrgent.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonUrgent.prototype.click = function() {
  l.view = 'urgent';
  l.display();
};


liste.prototype.loadUrgent = function(){
  var i, items = [], data, cids, col;
  $('#middle').empty();
  this.createCol(0);
  $('#level0').enableSelection();
  $('#level0').css({'width':'100%', 'max-width':'500px'});
  // Einträge laden
  col = '#level0-content';
  $(col).empty(); // Alle vorhandenen Einträge löschen
  cids = this.data.getUrgent();
  for (i in cids) {
    data = this.data.data[cids[i].cid];
    //items.push(this.item(data.cid, renderTimestamp(data.date) + ': ' + data.content, 'urgent'));
    items.push(this.data.data[cids[i].cid].render());
  } 
  this.contentList(col, items);
  this.markPath();
};


liste.prototype.loadUrgentColor = function(timestamp) {
  var now = new Date().getTime(), r=255, g=255, b = 255;
  now = now / 1000;
  g = (timestamp - now) * (255/(86400*5));
  g>255 && (g=255);
  g<0   && (r+=g); r < 150 && (r=150);
  g<0   && (g=0);
  g = b = Math.round(g);
  r = Math.round(r);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

data.prototype.getUrgent = function() {
  var cids = [], i;
  for (i in this.data) {
    if (this.data[i].date !== null) {cids.push({cid:i, date:this.data[i].date});}
  }
  cids.sort(function(a,b) {return a.date - b.date;});
  return cids;
};
