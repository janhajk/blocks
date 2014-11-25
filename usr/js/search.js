var searchDelayId = 0;

var searchfield = function(target) {
  var me   = this,
      name = me.name = 'searchfield' + uniqueId();

  
  // HTML einfügen
  $('#'+target).append(this.getHtml());
  
  // Bei Click ins Suchfeld dessen Inhalt löschen
  $('#'+name+'field').live('click',function(){this.value='';});
  
  // Bei Tastendruck in Feld mit Suche beginnen
  $('#'+name+'field').live('keyup', function(e){
    searchDelayId && clearTimeout(searchDelayId);
    searchDelayId = window.setTimeout('l.loadSearch($(\'#'+name+'field\').val())', 300);
  });
  
  // Textfeld verliert Fokus
  $('#'+name+'field').blur(function(){
    this.value = me.defaultValue;
  });
};

searchfield.prototype.defaultValue = 'Search...';


/**
 * HTML Code des Input Feldes
 */
searchfield.prototype.getHtml = function() {
  return '<div id="'+this.name+'" style="'+this.getStyleDiv()+'">'+
            '<input type="text" value="'+this.defaultValue+'" id="'+this.name+'field" style="'+this.getStyleInput()+'" class="noShortcuts" />'+
         '</div>';
};


/**
 * <div>-Styles
 */
searchfield.prototype.getStyleDiv = function() {
  return [
    'position     : relative',
    'width        : 110px',
    'height       : 20px',
    'margin       : 0',
    'padding      : 0',
    'margin-left  : 5px',
    'top          : 5px',
    'float        : left'
  ].join(';').replace(/ /g, '');
};

/**
 * <Input>-Styles
 */
searchfield.prototype.getStyleInput = function() {
  return [
    'width        : 100px',
    'height       : 15px',
    'margin       : 0',
    'padding      : 0'
  ].join(';').replace(/ /g,'');
};



data.prototype.search = function(s) {
  var cids = [], i;
  for (i in this.data) {
    this.data[i].content.search(new RegExp(s,'i')) !== -1 && cids.push({cid:i, weight:this.data[i].weight});
  }
  return cids.sort(function(a,b) {return a.weight - b.weight;});
};


liste.prototype.loadSearch = function(s){
  var i, items = [], cids;
  $('#middle').empty();
  this.createCol(0);
  $('#level0').enableSelection().css({'width':'100%', 'max-width':'500px'});
  cids = this.data.search(s);
  for (i in cids) {
    items.push(this.data.data[cids[i].cid].render('search'));
  } 
  this.contentList('#level0-content', items);
  this.markPath();
};

