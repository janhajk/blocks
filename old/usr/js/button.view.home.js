var buttonHome = function(type,title,target) {  
  buttonHome.parent.init.call(this,type,title,target,'m');
};
buttonHome.prototype             = new oButton();
buttonHome.prototype.constructor = oButton;
buttonHome.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonHome.prototype.click = function() {
  l.view = 'parent';
  l.display();
};




/**
 * Extends: liste
 * Default Hierarchical View
 * a.k.a. => 'parent'
 */
liste.prototype.loadParent = function() {
  var i, items = [], data, curId = this.data.selected, cids, col, first, d = this.data.data,
  topLevel = this.data.getLevel(this.data.selected) - 1,
  // Ändert die Reihenfolge nach einer Sortierung
  changeWeight = function(col) {
    var weight = [];
    $(col+' ul li.cItem').each(function(index) {
      var id = parseFloat(this.id.split('-')[1]); // e.g. this.id = listitem-123
      weight.push(id);
      d[id].weight = index;
    });
    $.post(window.janframe.ajax_target, {action:'weight',content:weight}, function() {});
  };
  
  if (this.data.data[curId] === undefined) {
    for (first in this.data.data) break;
    curId = this.data.data[first].cid;
    this.data.selected = curId;
    this.data.hasher.setActive(curId);
  } 
  this.data.data[curId].type===1 && (curId = this.data.data[curId].parents[0]); // Wenn Content, dann Parent nehmen
  
  this.createCols();  // Spalten erstellen
  // Siblings Kapitel laden
  col = '#level'+(topLevel+1)+'-content';
  $(col).empty(); // Alle vorhandenen Einträge löschen
  cids = this.data.getSiblings(curId);
  for (i in cids) {
    this.data.data[cids[i].cid].type===0 && items.push(this.data.data[cids[i].cid].render('sibling'));
  }
  this.contentList(col, items);
  $(col+' ul').sortable({update: function(){changeWeight('#level'+(topLevel+1)+'-content');}});

  // Parents Kapitel laden
  col = '#level'+(topLevel+0)+'-content';
  $(col).empty(); // Alle vorhandenen Einträge löschen
  items = [];
  cids = this.data.getParentLevel(curId);
  for (i in cids) {
    this.data.data[cids[i].cid].type===0 && items.push(this.data.data[cids[i].cid].render('parent'));
  }    
  this.contentList(col, items);
  $(col+' ul').sortable({update: function(){changeWeight('#level'+(topLevel+0)+'-content');}});
  
  // Children Kapitel laden
  col = '#level'+(topLevel+2)+'-content';
  $(col).empty(); // Alle vorhandenen Einträge löschen
  items = [];
  cids = this.data.getChildren(curId, 0);
  for (i in cids) {
    items.push(this.data.data[cids[i].cid].render('child'));
  }    
  this.contentList(col, items);
  $(col+' ul').sortable({update: function(){changeWeight('#level'+(topLevel+2)+'-content');}});
  
  // Content laden
  col = '#content-content';
  $(col).empty(); // Alle vorhandenen Einträge löschen
  items = [];
  cids = this.data.getChildren(curId, 1);
  for (i in cids) {
    items.push(this.data.data[cids[i].cid].render('childcontent'));
  }
  this.contentList(col, items);  
  $(col+' ul').sortable({update: function(){changeWeight('#content-content');}});
  this.markPath();
};



/**
 * Erzeugt alle Spalten
 */
liste.prototype.createCols = function() {
  var topLevel = this.data.getLevel(this.data.selected) - 1, i = topLevel;
  $('#middle').empty();  // Alle vorhandenen Spalten löschen  
  // Kapitel-Spalten erstellen
  for (i; i < topLevel+3; i++) {
    this.createCol(i);
  }
  // Content erstellen
  $('#middle').append('<div id="content"></div>');
  $('#content').append(this.fieldTitle('cheader', 'Inhalte', 'levelcol', false));
  $('#content').append('<div id="content-content"></div>');
};

/**
 * Erzeugt eine einzelne Spalte
 */
liste.prototype.createCol = function(id) {
    $('#middle').append('<div id="level'+id+'" class="chapterCol"></div><div class="vSeperator"></div>');
    $('#level'+id).append(this.fieldTitle('cheader-'+id,'Stufe '+(id), 'levelcol', false));
    $('#level'+id).append('<div id="level'+id+'-content" class="level-content"></div>');
    $('#level'+id).disableSelection();
};

/**
 * Erstellt eine Item Liste und fügt sie ein
 * @param target string das Target, unter welchem die Liste angefügt werden soll
 * @param items array Die Einträge welche zu einer ul-Liste zusammengefügt werden sollen
 */
liste.prototype.contentList = function(target, items) {
  $('<ul/>', {
    'class': 'list1', 
    html: items.join('')
    }).appendTo(target);
};


/**
 * Erstellt den Content eines Listenelementes
 */
liste.prototype.fieldTitle = function(cid, content, type) {
  return '<div id="sfield-'+cid+'" class="sfield '+type+'" style="background-color:'+(type==='urgent'?this.loadUrgentColor(this.data.data[cid].date):'')+'">'+
    '<div id="scontent-'+cid+'" class="scontent">'+content+'</div>'+
    '<div class="newline"></div>'+
  '</div>';        
};