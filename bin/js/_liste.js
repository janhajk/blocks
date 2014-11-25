var liste = function() {
  this.data = new data();
  this.data.setOwner(this);
  this.data.get();      // Initial Loading of data
  this.view = 'parent'; // default view of liste
  if (html.browser === 'mobile') {this.view = 'mobile';}  // mobile view of Liste
  

  /**
   * Eintrag auswählen
   */
  $('.list1 li:not(.buttonUp)').live('click', function(){
    l.data.selected = parseInt(this.id.split('-')[1],10);   // get selected Element
    l.data.hasher.setActive(l.data.selected);               // Update Hasher
    if (!l.data.data[l.data.selected].type) {l.display();}  // Update view on type = 0 (chapter)
    l.markPath();                                           // Mark Entries-path
  });
  
  /**
    * Adressbar bei Mouseover aktualisieren
    * Displays cid and date
    */
  $('.scontent').live('mouseover', function(e) {
    window.clearTimeout(showadressTimeout);
    var id = this.id.split('-')[1];
    if (isNaN(id)) {return false;}
    showadressTimeout = setTimeout('showAdressPreview(\''+id+'\', \''+(l.data.data[id].date===null?'kein Datum':renderTimestamp(l.data.data[id].date))+'\')', 700);
  });  
  // Adressbar reseten
  $('.scontent').live('mouseout', function(e) {
    var c = l.data.data[l.data.selected];
    $('#adressbar span').html('ID: '+ c.cid + '; Datum: '+(c.date!==null?renderTimestamp(c.date):'kein Datum'));
  });
  
};


/**
 * Lädt eine View
 * 
 * Views Funktionen sind immer von folgendem Format:
 * liste.prototype.load[Viewname] = function() {};
 * [Viewname] beginnt mit einem Grossbuchstaben
 * beim setzten der View wird der Name jedoch klein geschrieben
 * Bsp: l.view = 'bugs'
 */
liste.prototype.display = function() {
  var view = this.view;
  var f = eval('this.load'+(view[0].toUpperCase() + view.substring(1, view.length)));
  if(typeof f === 'function') {   // Check if view-Function exists
    eval('this.load'+(view[0].toUpperCase() + view.substring(1, view.length))+'()');
  }
  else {
    html.msgUpdate('Es wurde versucht, die unbekannte View "' + view + '" zu laden.');
    this.loadParent();            // Default View > hierarchical
  }
};

/**
  * Markiert den Pfad
  */
liste.prototype.markPath = function() {
  var cid = this.data.selected, pid = this.data.data[cid].parents[0]; // CUrrent selected ID and it's parent
  $('.sfield').removeClass('selectedli');   // Alle vorhandenen Markierungen löschen
  $('#sfield-'+cid).addClass('selectedli'); // Erstes Element markieren; start at the bottom of the tree
  while (pid !== 0) {
    $('#sfield-'+pid).addClass('selectedlineli');
    pid = this.data.data[pid].parents[0];   // go up the tree
    if (pid===undefined) {pid = 0;}
  }
}; 


/**
 * Show cid and Date in adressbar
 */
var showadressTimeout = true;
var showAdressPreview = function(id, date) {
    $('#adressbar span').html('ID: '+ id + '; Datum: ' + date);
    $('#adressbar span').hide();
    $('#adressbar span').show(500);
};
