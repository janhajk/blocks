var element = function(data) {
  var i;
  this.cid      = 0;
  this.content  = '';
  this.changed  = '';
  this.parents  = [];
  this.type     = 0;
  this.weight   = 0;
  this.active   = 1;
  this.date     = null;
  this.children = [[],[]];  // Children [Titel],[Content]
  this.revisions= [];
  this.trash    = 0;
  
  for (i in data) {
    this[i] = data[i];
  }
  this.parents = [data.revisions[0].pid];
  this.children = [[data.revisions[0].children],[]];
};

element.prototype.setContent = function(content) {
  this.content = content;
};

element.prototype.load = function() {
  
};


element.prototype.updateContent = function(content) {
  if (this.type === 0) {content = content.replace(/<(?:.|\n)*?>/gm, '');}
  var data  = l.data,
  owner = this,
  options = {
    action : 'update',
    id     : this.bid,
    content: content
  };
  $.post(data.target, options, function() { 
    owner.content = content;
    l.display();
    html.msg('Eintrag angepasst');
  }, 
  'json');
};

element.prototype.createNew = function() {
  var p = l.data.data[this.parents[0]];
  this.parents[0] = (p.type===1) ? p.parents[0] : this.parents[0]; // wenn content, dann ist parent nicht curId, sondern pid von curId
  var options = {
    action : 'add',
    id     : this.parents[0],
    type   : this.type,
    content: this.content
  },
  owner = this;
  $.post(l.data.target, options, function(data) { 
    owner.bid = data;
    l.data.data[owner.bid] = owner;
    l.display();
    html.msg('Neuer Eintrag hinzugef&uuml;gt');
  }, 
  'json');
};

element.prototype.toTrash = function() {
  var pid = this.parents[0],
  id   = this.bid,
  data = l.data.data,
  trashTree = function(bid) {
    var c;
    for (c in data[bid].children[0]) {
      trashTree(data[bid].children[0][c]);
    }
    for (c in data[bid].children[1]) {
      trashTree(data[bid].children[1][c]);
    }
    delete(l.data.data[bid]);
  },
  options = {
    action : 'trash',
    id     : id
  };
  $.post(l.data.target, options, function() { 
    trashTree(id);
    l.data.selected = pid; // After deleting, select parent as active item
    l.display();
    html.msg('der Eintrag wurde in den Papierkorb verschoben!');
  }, 
  'json');
};

element.prototype.recycle = function() {
  var id   = this.bid,
  options = {
    action : 'recycle',
    id     : id
  };
  $.post(l.data.target, options, function() { 
    l.data.selected = id; // After recycling, select id as active item
    l.data.get();
    html.msg('der Eintrag wurde wiederhergestellt!');
  }, 
  'json');
};

element.prototype.toggleActive = function() {
  var data = l.data.data,
  id = this.bid,
  state = this.active===0?1:0,
  toggleAll = function(bid) {
    var c;
    data[bid].active = state;
    for (c in data[bid].children[0]) {
      toggleAll(data[bid].children[0][c]);
    }
    for (c in data[bid].children[1]) {
      toggleAll(data[bid].children[1][c]);
    }
  },
  options = {
    action : 'toggleactive',
    id     : id
  };
  $.post(l.data.target, options, function() { 
    toggleAll(id);
    l.display();
    html.msg('Die Aktivit&auml;t des Eintrages wurde umgekehrt');
  }, 
  'json');
};

element.prototype.loadHistory = function() {
  var owner = this;
  $.post(l.data.target, {action:'history', id:l.data.selected}, function(data) {
      owner.revisions = data;
      l.view = 'diff';
      l.display();
  }, 
  'json');
};

element.prototype.renderHistory = function() {
  var i, items = [], content, dmp = new diff_match_patch(), d, html,
  render = function(id, value) {
    return '<li class="cItem"><div id="sfield-'+id+'" class="sfield" style="background-color:">'+
      '<div id="scontent-'+id+'" class="scontent">'+value+'</div>'+
      '<div class="newline"></div>'+
      '</div></li>';
  };
  for (i in this.revisions) {
    d = dmp.diff_main(this.revisions[i].value,this.content); 
    dmp.diff_cleanupSemantic(d);
    html = dmp.diff_prettyHtml(d).replace(/&amp;/g, '&').replace(/&lt;/g,'<').replace(/&gt;/g, '>').replace(/&para;<br>/g, '\n');
    content = renderTimestamp(this.revisions[i].changed) + '<div>'+html+'</div>';
    items.push(render(this.bid+'-'+i, content));
  } 
  return items;
};

/**
 * Erstellt das Listenelement
 */
element.prototype.render = function(level) {
  level = typeof level !== 'undefined' ? level : 'none';
  return '<li id="listeItem-' + this.bid + '" class="cItem" level="'+level+'">' + this.renderContent() + '</li>';
};

/**
 * Erstellt den Content eines Listenelementes
 */
element.prototype.renderContent = function() {
  return '<div id="sfield-'+this.bid+'" class="sfield" style="background-color:">'+
    '<div id="scontent-'+this.bid+'" class="scontent">'+this.formatForOutput()+'</div>'+
    '<div class="newline"></div>'+
  '</div>';        
};


/**
 * Format completed content
 * default: striked thorugh
 */
element.prototype.fCompleted = function(content) {
  return '<del>' + content + '</del>';
};

/**
 * Formats the content for Output
 * Strip HTML Tags for chapters,
 * show completed striked through
 * and Format the Tags
 */
element.prototype.formatForOutput = function() {
  var content = this.revisions[0].value;
  if (this.type === 0) {  // Chapter 
    content = content.replace(/<(?:.|\n)p*?>/gm,''); // Strip HTML for Chapters
    content += ' ('+this.children[1].length+')';
  }
  if (this.active === 0) { // Durchgestrichen
    content = this.fCompleted(content);
  }
  content = content.replace(/(#\w*)/ig, '<span style="cursor:pointer;color:#0084B4">$1</span>'); // Color #Tags
  return content;
};