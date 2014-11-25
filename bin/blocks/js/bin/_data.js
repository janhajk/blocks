var data = function() {
  this.owner;
  this.data     = {};         // Das Daten-Objekt
  this.target   = window.janframe.ajax_target;  // Ziel der Ajaxabfragen aus config.inc
  this.hasher   = new hasher();
  this.path     = this.hasher.active() ? this.hasher.getActive() : [92]; // Ausgewählte/Aktueller Eintrag
  this.selected = parseInt(this.hasher.active()?this.hasher.getActive():92,10); // Ausgewählte/Aktueller Eintrag
};

data.prototype.setOwner = function(owner) {
  this.owner = owner;
};

/**
 * AJAX Aktion zum laden der gesamten JSON data
 * aktualisiert ebenfalls die Ansicht
 */
data.prototype.get = function() {
  var me = this;
  this.data = {};
  $.get(this.target, function(data) { 
    var i;
    if (data !== null) {
      for (i in data) {
        me.data[i] = new element(data[i]);
      }
      me.owner.display();
    }
  }, 
  'json');
};

/**
 * Gibt die Hierarchiestufe/Level des Contents zurück
 * 1 = oberste Hierarchie
 */
data.prototype.getLevel = function(cid) {
  var data = this.data, level = 0;
  (function gLevel(id) {
    if (data[id].parents[0] === undefined || data[id].parents[0] === 0){
      return false;
    }
    level++;
    while (gLevel(data[id].parents[0])) {}
  })(cid);
  return level+1;
};



data.prototype.getParentLevel = function (cid) {
  var pid = this.data[cid].parents[0], pids = [], parent, i;
  if (pid == undefined || pid === 0) {return false;}  // oberste Stufe erreicht -> keine Parents vorhanden
  parent = this.data[pid].parents[0];
  for (i in this.data) {
    if (this.data[i].parents[0] === parent) {pids.push({cid:parseInt(i,10), weight:this.data[i].weight});}
  }
  pids.sort(function(a,b) {return a.weight - b.weight;});
  return pids;
};

data.prototype.getSiblings = function(cid) {
  var pid = this.data[cid].parents[0], cids = [], i;
  for (i in this.data) {
    if (this.data[i].parents[0] === pid) {cids.push({cid:parseInt(i,10), weight:this.data[i].weight});}
  }
  cids.sort(function(a,b) {return a.weight - b.weight;});
  return cids;
};

data.prototype.getChildren = function(cid, type) {
  // TODO:
  // Durchgestrichene Inhalte sollen zuunterst sortiert werden
  var pid = cid, cids = [], i;
  for (i in this.data) {
    if (this.data[i].type === type && this.data[i].parents[0] === pid) {cids.push({cid:parseInt(i,10), weight:this.data[i].weight});}
  }
  cids.sort(function(a,b) {return a.weight - b.weight;});
  return cids;
};






